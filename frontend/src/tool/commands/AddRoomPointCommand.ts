import Command from './Command'
import Point from '../model/Point';
import Room from '../model/Room';
import CreatorRooms from '../CreatorRooms';
import { getPointedRoomIndex, highlightRoom, dehighlight } from '../utils/RoomUtils';

export default class AddRoomPointCommand extends Command {
    private roomsData: CreatorRooms;
    private event: MouseEvent | any;
    private canvasContext: CanvasRenderingContext2D;

    constructor(roomsData: CreatorRooms, event: MouseEvent, canvasContext: CanvasRenderingContext2D) {
        super();

        this.roomsData = roomsData;
        this.event = event;
        this.canvasContext = canvasContext;
    }

    onClick(): void {
        const currentRoomPoints = this.roomsData.getCurrentRoom().points;
        const clickPosition: Point = {
            x: this.event.layerX - this.event.originalTarget.offsetLeft,
            y: this.event.layerY - this.event.originalTarget.offsetTop
        }

        if(currentRoomPoints.length > 2 && Math.abs(currentRoomPoints[0].x - (clickPosition.x)) < 10 && Math.abs(currentRoomPoints[0].y - (clickPosition.y)) < 10) {
            const newPoint: Point = {
                x: currentRoomPoints[0].x,
                y: currentRoomPoints[0].y
            }

            this.roomsData.getCurrentRoom().addPoint(newPoint);
            this.roomsData.getRooms().push(this.roomsData.getCurrentRoom());
            this.roomsData.setCurrentRoom(new Room());

            this.action = {
                type: "finished"
            }
        } else {
            const newPoint: Point = {
                x: clickPosition.x, 
                y: clickPosition.y
            }
            this.roomsData.getCurrentRoom().addPoint(newPoint);

            this.action = {
                type: "added",
                point: newPoint
            }
        }
    }

    onRightClick(): void {
        const currentRoomPoints = this.roomsData.getCurrentRoom().points;

        const removedPoint =currentRoomPoints[currentRoomPoints.length - 1];
        this.roomsData.getCurrentRoom().removePoint();
        
        this.action = {
            type: "removed",
            point: removedPoint
        }
    }

    onMove(): void {
        const currentRoomPoints = this.roomsData.getCurrentRoom().points;
        const clickPosition: Point = {
            x: this.event.layerX - this.event.originalTarget.offsetLeft,
            y: this.event.layerY - this.event.originalTarget.offsetTop
        }

        if(this.roomsData.getCurrentRoom().points.length !== 0) {
            dehighlight(this.roomsData.getRooms());

            this.canvasContext.moveTo(
                currentRoomPoints[currentRoomPoints.length -1].x, 
                currentRoomPoints[currentRoomPoints.length -1].y
            );

            this.canvasContext.strokeStyle = "0, 209, 81";
            this.canvasContext.lineWidth = 2;
            
            this.canvasContext.lineTo(clickPosition.x, clickPosition.y);
            this.canvasContext.stroke();
        } else {
            const pointedRoomIndex = getPointedRoomIndex(clickPosition, this.roomsData.getRooms());
            highlightRoom(this.roomsData.getRooms(), pointedRoomIndex);
        }
    }

    undo(): void {
        switch(this.action.type) {
            case "added":
                this.roomsData.getCurrentRoom().removePoint();
                break;
            case "removed":
                this.roomsData.getCurrentRoom().addPoint(this.action.point);
                break;
            case "finished":
                const prevRooms: Room[] = this.roomsData.getRooms();
                const prevRoom: Room = prevRooms[prevRooms.length - 1];
                
                prevRoom.removePoint();
                this.roomsData.setRooms(prevRooms.splice(0, prevRooms.length - 1));
                this.roomsData.setCurrentRoom(prevRoom);
                break;
        }
    }

    redo(): void {
        switch(this.action.type) {
            case "added":
                this.onClick();
                break;
            case "removed":
                this.onRightClick();
                break;
            case "finished":
                this.onClick();
                break;
        }
    }
}