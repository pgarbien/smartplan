import Command from './Command';
import Point from '../model/Point';
import CanvasDrawer from '../CanvasDrawer';
import CreatorRooms from '../CreatorRooms';
import NewDevice from '../model/NewDevice';
import CreatorNewDevices from '../CreatorNewDevices';
import { getClosePointDevice, getCloseOrInLineDevice, getInLinePoints } from '../utils/DrawingUtils';

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
        this.creatorDevices.setCurrentDevice(new NewDevice());
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

    // TODO [Brawurka] Fixed fitting to line 
    onDownMove(cursorPosition: Point): void {
        if(this.action) {
            const horizontalDelta: number = cursorPosition.x - this.action.cursorPosition.x;
            const verticalDelta: number = cursorPosition.y - this.action.cursorPosition.y;
            const vector: Point = new Point(horizontalDelta, verticalDelta);
            const position = this.getModifiedPosition(cursorPosition);

            if(this.action.type === "pointMove") {
                const movedPoint: Point = this.action.details.movedPoint;
                const startPoint: Point = this.action.details.startPoint;

                movedPoint.x = startPoint.x + vector.x;
                movedPoint.y = startPoint.y + vector.y;   

                const inLinePoints = getInLinePoints(this.roomsData.getRooms(), position);
                
                // [Brawurka] inLinePoints są zapisane dobrze, ale canvasDrawer nie rysuje tak jak powinien :c jeśli przerzucimy to do onMove to będzie działać
                inLinePoints.forEach(point => {
                    this.canvasDrawer.drawLine(point, movedPoint);
                    this.canvasDrawer.highlightPoint(point);
                });
            }
        
        }
    }

    onUp(cursorPosition: Point): void {
        if(this.action) {
            const endPoint: Point = this.action.details.movedPoint.getCopy();

            this.action.details.endPoint = endPoint;
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