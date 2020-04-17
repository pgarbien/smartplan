import Command from './Command'
import Point from '../model/Point';
import Room from '../model/Room';
import CreatorRooms from '../CreatorRooms';
import { getPointedRoomIndex, highlightRoom, dehighlight } from '../utils/RoomUtils';
import { getClosePoint, getCloseOrInLine, getInLinePoints } from '../utils/DrawingUtils';
import CanvasDrawer from '../CanvasDrawer';

export default class AddRoomPointCommand extends Command {
    private roomsData: CreatorRooms;
    private cursorPosition: Point;
    private canvasDrawer: CanvasDrawer;

    constructor(roomsData: CreatorRooms, cursorPosition: Point, canvasDrawer: CanvasDrawer) {
        super();

        this.roomsData = roomsData;
        this.cursorPosition = cursorPosition;
        this.canvasDrawer = canvasDrawer;
    }

    onClick(): void {
        const currentRoomPoints: Point[] = this.roomsData.getCurrentRoom().points;

        const position = this.getModifiedPosition();

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

        if(currentRoomPoints.length > 0) {
            const removedPoint = currentRoomPoints[currentRoomPoints.length - 1];
            this.roomsData.getCurrentRoom().removePoint();
            
            this.action = {
                type: "removedPoint",
                point: removedPoint
            }
        } else {
            const pointerRoomIndex: number = getPointedRoomIndex(this.cursorPosition, this.roomsData.getRooms());
            if(pointerRoomIndex > 0) {
                const rooms = this.roomsData.getRooms();
                const removedRoom = rooms.splice(pointerRoomIndex, 1);
                this.roomsData.setRooms(rooms);
            
                this.action = {
                    type: "removedRoom",
                    room: removedRoom[0]
                }
            }
        }
    }

    onMove(): void {
        const currentRoomPoints: Point[] = this.roomsData.getCurrentRoom().points;

        const closePoint: Point | null = getClosePoint(this.roomsData.getRooms(), this.cursorPosition);
        const position = this.getModifiedPosition();

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

            this.canvasDrawer.drawLine(startPoint, endPoint, true);
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
            case "removedPoint":
                this.roomsData.getCurrentRoom().addPoint(this.action.point);
                break;
            case "removedRoom":
                this.action.room.setHighlighted(false);
                this.roomsData.getRooms().push(this.action.room);
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
            case "removedPoint":
                this.onRightClick();
                break;
            case "removedRoom":
                this.onRightClick();
                break;
            case "finished":
                this.onClick();
                break;
        }
    }

    private getModifiedPosition() {
        const closeOrInlinePoint: Point | null = getCloseOrInLine(this.roomsData.getCurrentRoom(), this.roomsData.getRooms(), this.cursorPosition);
        return closeOrInlinePoint ? closeOrInlinePoint : this.cursorPosition;
    }
}