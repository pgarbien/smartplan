import CanvasDrawer from "../CanvasDrawer";
import CreatorNewDevices from "../CreatorNewDevices";
import CreatorRooms from "../CreatorRooms";
import Point from "../model/Point";
import Wall from "../model/Wall";
import { getCloseLine, getCloseOrInLineDevice, getClosePointDevice, getInLinePoints } from "../utils/DrawingUtils";
import Command from "./Command";

export default class MoveDeviceCommand extends Command {
    private creatorDevices: CreatorNewDevices;
    private creatorAddedDevices: CreatorNewDevices;
    private roomsData: CreatorRooms;
    private canvasDrawer: CanvasDrawer;

    constructor(creatorDevices: CreatorNewDevices, creatorAddedDevices: CreatorNewDevices, roomsData: CreatorRooms, canvasDrawer: CanvasDrawer) {
        super();

        this.creatorDevices = creatorDevices;
        this.creatorAddedDevices = creatorAddedDevices;
        this.roomsData = roomsData;
        this.canvasDrawer = canvasDrawer;
    }
    
    onClick(cursorPosition: Point, callback?: Function): void {
    }

    onRightClick(cursorPosition: Point): void {
    }

    onMove(cursorPosition: Point): void {
        const closePoint: Point | null = getClosePointDevice(this.creatorAddedDevices.getDevices(), cursorPosition);
        this.canvasDrawer.setCursor(closePoint ? "grab" : "default")
    }

    onDown(cursorPosition: Point): void {
        const position = this.getModifiedPosition(cursorPosition);
        
        const closePoint: Point | null = getClosePointDevice(this.creatorAddedDevices.getDevices(), cursorPosition);

        if(closePoint) {
            const previousPoint: Point = new Point(closePoint.x, closePoint.y);
            
            this.canvasDrawer.setCursor("grabbing")
            this.action = {
                type: "pointMove",
                cursorPosition: cursorPosition,
                details: {
                    movedPoint: closePoint,
                    startPoint: previousPoint
                }
            }
        }
    }

    onDownMove(cursorPosition: Point): void {
        if(this.action) {
            const horizontalDelta: number = cursorPosition.x - this.action.cursorPosition.x;
            const verticalDelta: number = cursorPosition.y - this.action.cursorPosition.y;
            const vector: Point = new Point(horizontalDelta, verticalDelta);
            const position = this.getModifiedPosition(cursorPosition);
            const closeWall: Wall | null = getCloseLine(this.roomsData.getRooms(), cursorPosition);

            if(this.action.type === "pointMove") {
                let movedPoint: Point = this.action.details.movedPoint;
                const startPoint: Point = this.action.details.startPoint;

                movedPoint.x = startPoint.x + vector.x;
                movedPoint.y = startPoint.y + vector.y;

                const inLinePoints = getInLinePoints(this.roomsData.getRooms(), position);
                
                inLinePoints.forEach(point => {
                    this.canvasDrawer.drawLine(point, position);
                    this.canvasDrawer.highlightPoint(point);

                    if(closeWall) {
                        if(closeWall.start.y == closeWall.end.y) {
                            movedPoint.y = closeWall.end.y;
                        } else if (closeWall.start.x == closeWall.end.x) {
                            movedPoint.x = closeWall.end.x
                        }
                    }
                });

            }
            
         }
    }

    private getModifiedPosition(cursorPosition: Point) {
        const cloreOrInLinePoint: Point | null = getCloseOrInLineDevice(this.creatorDevices.getCurrentDevice(), this.creatorDevices.getDevices(), cursorPosition);
        return cloreOrInLinePoint ? cloreOrInLinePoint : cursorPosition;
    }

    onUp(cursorPosition: Point): void {
        const closePoint: Wall | null = getCloseLine(this.roomsData.getRooms(), cursorPosition);
        
        if(this.action) {
            const endPoint: Point = new Point(this.action.details.movedPoint.x, this.action.details.movedPoint.y);

            this.canvasDrawer.setCursor("grab")
            this.action.details.endPoint = endPoint;

            if(this.action.type === 'pointMove') {
                const closePoint: Wall | null = getCloseLine(this.roomsData.getRooms(), cursorPosition);
            }
        }
    }

    undo(): void {
        switch(this.action!!.type) {
            case "removedDevice":
                this.creatorDevices.getDevices().push(this.action!!.details.device);
                break;
            case "pointMove":
                const startPoint = this.action?.details.startPoint;

                this.action!!.details.movedPoint.x = startPoint.x;
                this.action!!.details.movedPoint.y = startPoint.y; 
                break;
        }

        
    }

    redo(): void {
        switch(this.action!!.type) {
            case "removedDevice":
                this.onRightClick(this.action!!.cursorPosition)
                break;
            case "pointMove":
                const endPoint = this.action?.details.endPoint;

                this.action!!.details.movedPoint.x = endPoint.x;
                this.action!!.details.movedPoint.y = endPoint.y;
                break;
        }
    }
}