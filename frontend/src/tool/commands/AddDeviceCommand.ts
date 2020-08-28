import Command from './Command';
import Point from '../model/Point';
import CanvasDrawer from '../CanvasDrawer';
import CreatorRooms from '../CreatorRooms';
import NewDevice from '../model/NewDevice';
import CreatorNewDevices from '../CreatorNewDevices';
import { getClosePointDevice, getCloseOrInLineDevice, getInLinePoints } from '../utils/DrawingUtils';
import { getPointedRoomIndex, highlightRoom, dehighlight } from '../utils/RoomUtils';
import { getClosePoint, getCloseOrInLine, getCloseLine } from '../utils/DrawingUtils';
import Wall from '../model/Wall';

export default class AddDeviceCommand extends Command {
    private creatorDevices: CreatorNewDevices;
    private roomsData: CreatorRooms;
    private canvasDrawer: CanvasDrawer;

    constructor(creatorDevices: CreatorNewDevices, roomsData: CreatorRooms, canvasDrawer: CanvasDrawer) {
        super();

        this.creatorDevices = creatorDevices;
        this.roomsData = roomsData;
        this.canvasDrawer = canvasDrawer;
    }

    drawNewDevice() {
        this.creatorDevices.getDevices().push(this.creatorDevices.getCurrentDevice());
        this.creatorDevices.setCurrentDevice(new NewDevice("rgba(0, 128,128,128)"));
    }

    onClick(cursorPosition: Point): void {
        
    }

    onRightClick(cursorPosition: Point): void {
        this.creatorDevices.getDevices().forEach(device => {
            if(Math.abs(cursorPosition.x - device.point.x) < device.radius
                && Math.abs(cursorPosition.y - device.point.y) < device.radius) {
                    this.action = {
                        type: "removedDevice",
                        cursorPosition: cursorPosition,
                        details: {
                            device: device
                        }
                    }

                    this.creatorDevices.removeDevice(device);
            }
        });
    }

    onMove(cursorPosition: Point): void {

    }

    onDown(cursorPosition: Point): void {
        const position = this.getModifiedPosition(cursorPosition);
        const closePoint: Point | null = getClosePointDevice(this.creatorDevices.getDevices(), cursorPosition);

        if(closePoint) {
            const previousPoint: Point = closePoint.getCopy();
            
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

    // TODO [Brawurka] Fix fitting to line 
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

    onUp(cursorPosition: Point): void {
        if(this.action) {
            const endPoint: Point = this.action.details.movedPoint.getCopy();

            this.action.details.endPoint = endPoint;

            if(this.action.type === 'pointMove') {
                const closePoint: Wall | null = getCloseLine(this.roomsData.getRooms(), cursorPosition);

                if(closePoint) {
                    console.log("d");
                    
                }
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

    private getModifiedPosition(cursorPosition: Point) {
        const cloreOrInLinePoint: Point | null = getCloseOrInLineDevice(this.creatorDevices.getCurrentDevice(), this.creatorDevices.getDevices(), cursorPosition);
        return cloreOrInLinePoint ? cloreOrInLinePoint : cursorPosition;
    }

}