import Command from './Command';
import Point from '../model/Point';
import Wall from '../model/Wall';
import Room from '../model/Room';
import CreatorRooms from '../CreatorRooms';
import { getPointedRoomIndex, highlightRoom, dehighlight } from '../utils/RoomUtils';
import { getClosePoint, getCloseOrInLine, getCloseLine } from '../utils/DrawingUtils';
import CanvasDrawer from '../CanvasDrawer';
import CreatorNewDevices from '../CreatorNewDevices';

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
        this.devicesData.getDevices().forEach(function(device) {
            if(Math.abs(cursorPosition.x - device.point.x) < device.radius
            && Math.abs(cursorPosition.y - device.point.y) < device.radius){
                device.color = device.color == "grey"? "green" : "grey";
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