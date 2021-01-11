import Command from './Command';
import Point from '../model/Point';
import CreatorRooms from '../CreatorRooms';
import CanvasDrawer from '../CanvasDrawer';
import CreatorNewDevices from '../CreatorNewDevices';
import NewDevice from '../model/NewDevice';

export default class ManageCommand extends Command {
    private roomsData: CreatorRooms;
    private devicesData: CreatorNewDevices;
    private canvasDrawer: CanvasDrawer;

    isOnHold = false;

    constructor(roomsData: CreatorRooms, devicesData: CreatorNewDevices, canvasDrawer: CanvasDrawer) {
        super();

        this.roomsData = roomsData;
        this.devicesData = devicesData;
        this.canvasDrawer = canvasDrawer;
    }

    onClick(cursorPosition: Point, callback: Function): void {
        this.devicesData.getDevices().forEach((device) => {
            if(device.point != null) {
                if(Math.abs(cursorPosition.x - device.point.x) < 0.01
                && Math.abs(cursorPosition.y - device.point.y) < 0.01){
                    callback(device);
                }
            }
        })
    }

    onRightClick(cursorPosition: Point, callback: Function): void {
        this.devicesData.getDevices().forEach((device) => {
            if(device.point != null) {
                if(Math.abs(cursorPosition.x - device.point.x) < 0.01
                && Math.abs(cursorPosition.y - device.point.y) < 0.01){
                    callback(device);
                }
            }
        })
    }

    onMove(cursorPosition: Point): void {
        const close = this.devicesData.getDevices().some((device) => {
            return device.point && 
                Math.abs(cursorPosition.x - device.point.x) < 0.01 && 
                Math.abs(cursorPosition.y - device.point.y) < 0.01
        })

        this.canvasDrawer.setCursor(close ? "pointer" : "default")
    }

    onDown(cursorPosition: Point, callback: Function): void {
        this.isOnHold = true;
        this.devicesData.getDevices().forEach((device) => {
            if(device.point != null) {
                setTimeout(() =>{
                    if(this.isOnHold) {
                        if(device.point != null) {
                            if(Math.abs(cursorPosition.x - device.point.x) < 0.01
                            && Math.abs(cursorPosition.y - device.point.y) < 0.01){
                                callback(device);
                            }
                        }
                    }
                }, 250);
            }
        })
    }

    onDownMove(cursorPosition: Point): void {
        
    }

    onUp(cursorPosition: Point): void {
        this.isOnHold = false;
    }

    undo(): void {
        
    }

    redo(): void {
        
    }
}