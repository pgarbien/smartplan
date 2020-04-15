import Command from './Command'
import Point from '../model/Point';
import Room from '../model/Room';
import CreatorRooms from '../CreatorRooms';
import { getPointedRoomIndex, highlightRoom, dehighlight } from '../utils/RoomUtils';
import { getClosePoint, getCloseOrInLine, getInLinePoints } from '../utils/DrawingUtils';
import CanvasDrawer from '../CanvasDrawer';

export default class AddRoomPointCommand extends Command {
    private roomsData: CreatorRooms;
    private event: MouseEvent | any;
    private canvasDrawer: CanvasDrawer;

    constructor(roomsData: CreatorRooms, event: MouseEvent, canvasDrawer: CanvasDrawer) {
        super();

        this.roomsData = roomsData;
        this.event = event;
        this.canvasDrawer = canvasDrawer;
    }

    onClick(): void {
        const currentRoomPoints: Point[] = this.roomsData.getCurrentRoom().points;
        const clickPosition: Point = {
            x: this.event.layerX - this.event.originalTarget.offsetLeft,
            y: this.event.layerY - this.event.originalTarget.offsetTop
        }

        const closeOrInlinePoint: Point | null = getCloseOrInLine(this.roomsData.getCurrentRoom(), this.roomsData.getRooms(), clickPosition);
        const position: Point = closeOrInlinePoint ? closeOrInlinePoint : clickPosition;

        if(currentRoomPoints.length > 2 && Math.abs(currentRoomPoints[0].x - (position.x)) < 10 && Math.abs(currentRoomPoints[0].y - (position.y)) < 10) {
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
                x: position.x, 
                y: position.y
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
        const clickPosition: Point = {
            x: this.event.layerX - this.event.originalTarget.offsetLeft,
            y: this.event.layerY - this.event.originalTarget.offsetTop
        }

        if(currentRoomPoints.length > 0) {
            const removedPoint = currentRoomPoints[currentRoomPoints.length - 1];
            this.roomsData.getCurrentRoom().removePoint();
            
            this.action = {
                type: "removed",
                point: removedPoint
            }
        } else {
            const pointerRoomIndex: number = getPointedRoomIndex(clickPosition, this.roomsData.getRooms());
            if(pointerRoomIndex > 0) {
                const rooms = this.roomsData.getRooms();
                rooms.splice(pointerRoomIndex, 1);
                this.roomsData.setRooms(rooms);
            }
        }
    }

    onMove(): void {
        const currentRoomPoints: Point[] = this.roomsData.getCurrentRoom().points;
        const hoverPosition: Point = {
            x: this.event.layerX - this.event.originalTarget.offsetLeft,
            y: this.event.layerY - this.event.originalTarget.offsetTop
        }

        const closePoint: Point | null = getClosePoint(this.roomsData.getRooms(), hoverPosition);
        const closeOrInlinePoint: Point | null = getCloseOrInLine(this.roomsData.getCurrentRoom(), this.roomsData.getRooms(), hoverPosition);
        const position: Point = closeOrInlinePoint ? closeOrInlinePoint : hoverPosition;

        if(closePoint) {
            this.canvasDrawer.highlightPoint(closePoint);
        }

        if(this.roomsData.getCurrentRoom().points.length !== 0) {
            const inLinePoints = getInLinePoints(this.roomsData.getRooms(), position);
            inLinePoints.forEach(point => {
                this.canvasDrawer.drawLine(position, point);
                this.canvasDrawer.highlightPoint(point);
            });

            dehighlight(this.roomsData.getRooms());

            const startPoint: Point = {
                x: currentRoomPoints[currentRoomPoints.length -1].x, 
                y: currentRoomPoints[currentRoomPoints.length -1].y
            }

            const endPoint: Point = {
                x: position.x, 
                y: position.y
            }

            this.canvasDrawer.drawLine(startPoint, endPoint);
        } else {
            const pointedRoomIndex = getPointedRoomIndex(position, this.roomsData.getRooms());
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