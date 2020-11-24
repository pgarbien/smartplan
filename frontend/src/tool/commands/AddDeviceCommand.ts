import Command from './Command';
import Point from '../model/Point';
import CanvasDrawer from '../CanvasDrawer';
import CreatorRooms from '../CreatorRooms';
import NewDevice from '../model/NewDevice';
import CreatorNewDevices from '../CreatorNewDevices';
import { getClosePointDevice, getCloseOrInLineDevice, getInLinePoints } from '../utils/DrawingUtils';
import { getCloseLine } from '../utils/DrawingUtils';
import Wall from '../model/Wall';
import mAxios from '../../utils/API';

export default class AddDeviceCommand extends Command {
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

        this.canvasDrawer.setCursor("pointer")
    }

    drawNewDevice(deviceName: string, color: string, id: string, position: Point, roomId: string, locationId: string, levelId: string) {
        if(color == null || color === "") {
            color = "rgba(0, 209, 81, 1)"
        }
        const device = new NewDevice(deviceName, color, id, position, null, null, roomId, locationId, levelId);
        this.creatorAddedDevices.setCurrentDevice(device);
        this.creatorAddedDevices.getDevices().push(this.creatorAddedDevices.getCurrentDevice());
    
        mAxios.put('/devices', this.creatorAddedDevices.getDevices());
        var devIndex = this.creatorDevices.getDevices().map(x => {
            return x.id;
        }).indexOf(device.id);
        this.creatorDevices.getDevices().splice(devIndex, 1);
    }

    removeDevice(device: NewDevice) {
        device.point = null;
        device.levelId = null;
        device.locationId = null;
        device.roomId = null;
        this.creatorAddedDevices.removeDevice(device);
        this.creatorDevices.getDevices().forEach(dev => {
            if(dev.id == device.id) {
                this.creatorDevices.removeDevice(dev);
                mAxios.put('/devices', this.creatorDevices.getDevices()).catch(error => console.log(error));
            }
        });
        this.creatorDevices.getDevices().push(device);
        mAxios.put('/devices', this.creatorDevices.getDevices()).catch(error => console.log(error));
    }

    onClick(cursorPosition: Point, callback: Function): void {
        callback(cursorPosition);
    }

    onRightClick(cursorPosition: Point): void {
        this.creatorAddedDevices.getDevices().forEach(device => {
            if(device.point != null) {
                if(Math.abs(cursorPosition.x - device.point.x) < 0.01
                && Math.abs(cursorPosition.y - device.point.y) < 0.01) {
                    this.action = {
                        type: "removedDevice",
                        cursorPosition: cursorPosition,
                        details: {
                            device: device
                        }
                    }
                    this.removeDevice(device)
            }
            }
        });
    }

    onMove(cursorPosition: Point): void {

    }

    onDown(cursorPosition: Point): void {
        const position = this.getModifiedPosition(cursorPosition);
        
        const closePoint: Point | null = getClosePointDevice(this.creatorAddedDevices.getDevices(), cursorPosition);

        if(closePoint) {

            const previousPoint: Point = new Point(closePoint.x, closePoint.y);
            
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
            const endPoint: Point = new Point(this.action.details.movedPoint.x, this.action.details.movedPoint.y);

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

    private getModifiedPosition(cursorPosition: Point) {
        const cloreOrInLinePoint: Point | null = getCloseOrInLineDevice(this.creatorDevices.getCurrentDevice(), this.creatorDevices.getDevices(), cursorPosition);
        return cloreOrInLinePoint ? cloreOrInLinePoint : cursorPosition;
    }

}