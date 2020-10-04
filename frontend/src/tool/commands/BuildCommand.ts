import Command from './Command'
import Point from '../model/Point';
import Room from '../model/Room';
import CreatorRooms from '../CreatorRooms';
import { getPointedRoomIndex, highlightRoom, dehighlight } from '../utils/RoomUtils';
import { getClosePoint, getCloseOrInLine, getInLinePoints } from '../utils/DrawingUtils';
import CanvasDrawer from '../CanvasDrawer';

export default class BuildCommand extends Command {
    private roomsData: CreatorRooms;
    private canvasDrawer: CanvasDrawer;

    constructor(roomsData: CreatorRooms, canvasDrawer: CanvasDrawer) {
        super();

        this.roomsData = roomsData;
        this.canvasDrawer = canvasDrawer;
    }

    onClick(cursorPosition: Point, callback?: Function): void {
        const currentRoomPoints: Point[] = this.roomsData.getCurrentRoom().points;

        const position = this.getModifiedPosition(cursorPosition);

        if(currentRoomPoints.length > 2 && Math.abs(currentRoomPoints[0].x - (position.x)) < 10 && Math.abs(currentRoomPoints[0].y - (position.y)) < 10) {
            this.roomsData.getRooms().push(this.roomsData.getCurrentRoom());
            if(callback) callback(this.roomsData.getCurrentRoom());
            this.roomsData.setCurrentRoom(new Room());

            this.action = {
                type: "finished",
                cursorPosition: cursorPosition,
                details: {}
            }
        } else {
            const newPoint: Point = position.getCopy();
            this.roomsData.getCurrentRoom().addPoint(newPoint);

            this.action = {
                type: "added",
                cursorPosition: cursorPosition,
                details: {
                    point: newPoint
                }
            }
        }
    }

    onRightClick(cursorPosition: Point): void {
        const currentRoomPoints = this.roomsData.getCurrentRoom().points;

        if(currentRoomPoints.length > 0) {
            const removedPoint = currentRoomPoints[currentRoomPoints.length - 1];
            this.roomsData.getCurrentRoom().removePoint();
            
            this.action = {
                type: "removedPoint",
                cursorPosition: cursorPosition,
                details: {
                    point: removedPoint
                }
            }
        } else {
            const pointerRoomIndex: number = getPointedRoomIndex(cursorPosition, this.roomsData.getRooms());
            if(pointerRoomIndex > 0) {
                const rooms = this.roomsData.getRooms();
                const removedRoom = rooms.splice(pointerRoomIndex, 1);
                this.roomsData.setRooms(rooms);
            
                this.action = {
                    type: "removedRoom",
                    cursorPosition: cursorPosition,
                    details: {
                        room: removedRoom[0]
                    }
                }
            }
        }
    }

    onMove(cursorPosition: Point): void {
        const position = this.getModifiedPosition(cursorPosition);
        const pointedRoomIndex = getPointedRoomIndex(position, this.roomsData.getRooms());
        const currentRoomPoints: Point[] = this.roomsData.getCurrentRoom().points;
        const closePoint: Point | null = getClosePoint(this.roomsData.getRooms(), cursorPosition); 
        const constructingRoom: Boolean = this.roomsData.getCurrentRoom().points.length !== 0;

        dehighlight(this.roomsData.getRooms());
        if(closePoint) {
            this.canvasDrawer.highlightPoint(closePoint);
        } else if(!constructingRoom && pointedRoomIndex > 0) {
            highlightRoom(this.roomsData.getRooms(), pointedRoomIndex);
        }

        if(constructingRoom) {
            const inLinePoints = getInLinePoints(this.roomsData.getRooms(), position);
            inLinePoints.forEach(point => {
                this.canvasDrawer.drawLine(point, position);
                this.canvasDrawer.highlightPoint(point);
            });

            const startPoint: Point = currentRoomPoints[currentRoomPoints.length -1].getCopy();
            const endPoint: Point = position.getCopy();

            this.canvasDrawer.drawLine(startPoint, endPoint, true);
        }
    }

    onDown(cursorPosition: Point): void {

    }

    onDownMove(cursorPosition: Point): void {

    }

    onUp(cursorPosition: Point): void {

    }

    undo(): void {
        switch(this.action!!.type) {
            case "added":
                this.roomsData.getCurrentRoom().removePoint();
                break;
            case "removedPoint":
                this.roomsData.getCurrentRoom().addPoint(this.action!!.details.point);
                break;
            case "removedRoom":
                this.action!!.details.room.setHighlighted(false);
                this.roomsData.getRooms().push(this.action!!.details.room);
                break;
            case "finished":
                const prevRooms: Room[] = this.roomsData.getRooms();
                const prevRoom: Room = prevRooms[prevRooms.length - 1];
                
                this.roomsData.setRooms(prevRooms.splice(0, prevRooms.length - 1));
                this.roomsData.setCurrentRoom(prevRoom);
                break;
        }
    }

    redo(): void {
        switch(this.action!!.type) {
            case "added":
                this.onClick(this.action!!.cursorPosition);
                break;
            case "removedPoint":
                this.onRightClick(this.action!!.cursorPosition);
                break;
            case "removedRoom":
                this.onRightClick(this.action!!.cursorPosition);
                break;
            case "finished":
                this.onClick(this.action!!.cursorPosition);
                break;
        }
    }

    private getModifiedPosition(cursorPosition: Point) {
        const closeOrInlinePoint: Point | null = getCloseOrInLine(this.roomsData.getCurrentRoom(), this.roomsData.getRooms(), cursorPosition);
        return closeOrInlinePoint ? closeOrInlinePoint : cursorPosition;
    }
}