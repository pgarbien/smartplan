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

    constructor(roomsData: CreatorRooms, devicesData: CreatorNewDevices, canvasDrawer: CanvasDrawer) {
        super();

        this.roomsData = roomsData;
        this.devicesData = devicesData;
        this.canvasDrawer = canvasDrawer;
    }

    onClick(cursorPosition: Point): void {
        this.devicesData.getDevices().forEach((device) => {
            if(Math.abs(cursorPosition.x - device.point.x) < device.radius
            && Math.abs(cursorPosition.y - device.point.y) < device.radius){
                console.log(`${device.name}`);
            }
        })
    }

    onRightClick(cursorPosition: Point): void {
    }

    onMove(cursorPosition: Point): void {
        
    }

    onDown(cursorPosition: Point): void {
        
    }

    onDownMove(cursorPosition: Point): void {
        
    }

    onUp(cursorPosition: Point): void {
       
    }

    undo(): void {
        
    }

    redo(): void {
        
    }
}