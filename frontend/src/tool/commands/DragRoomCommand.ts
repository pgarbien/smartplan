import Command from './Command'
import Point from '../model/Point';
import Room from '../model/Room';
import CreatorRooms from '../CreatorRooms';
import { getPointedRoomIndex, highlightRoom, dehighlight } from '../utils/RoomUtils';
import { getClosePoint, getCloseOrInLine, getInLinePoints } from '../utils/DrawingUtils';
import CanvasDrawer from '../CanvasDrawer';

export default class DragRoomCommand extends Command {
    private roomsData: CreatorRooms;
    private canvasDrawer: CanvasDrawer;

    constructor(roomsData: CreatorRooms, canvasDrawer: CanvasDrawer) {
        super();

        this.roomsData = roomsData;
        this.canvasDrawer = canvasDrawer;
    }

    onClick(cursorPosition: Point): void {

    }

    onRightClick(cursorPosition: Point): void {

    }

    onMove(cursorPosition: Point): void {
        const closePoint: Point | null = getClosePoint(this.roomsData.getRooms(), cursorPosition);
        const position = this.getModifiedPosition(cursorPosition);

        if(closePoint) {
            this.canvasDrawer.highlightPoint(closePoint);
        }

        const pointedRoomIndex = getPointedRoomIndex(position, this.roomsData.getRooms());
        highlightRoom(this.roomsData.getRooms(), pointedRoomIndex);
    }

    onDown(cursorPosition: Point): void {
        const pointedRoomIndex = getPointedRoomIndex(cursorPosition, this.roomsData.getRooms());

        if(pointedRoomIndex > 0) {
            const pointedRoom = this.roomsData.getRooms()[pointedRoomIndex];

            const previousPoints: Point[] = [];
            pointedRoom.points.forEach(point => {
                previousPoints.push({
                    x: point.x,
                    y: point.y
                });
            });
            
            this.action = {
                type: "roomMove",
                cursorPosition: cursorPosition,
                details: {
                    movedRoom: pointedRoom,
                    startPoints: previousPoints
                }
            }
        }
    }

    onDownMove(cursorPosition: Point): void {
        if(this.action) {
            const movedRoom: Room = this.action.details.movedRoom;
            const startPoints: Point[] = this.action.details.startPoints;

            const vector: Point = {
                x: this.action.cursorPosition.x - cursorPosition.x,
                y: this.action.cursorPosition.y - cursorPosition.y
            }

            movedRoom.points.forEach((point, index) => {
                point.x = startPoints[index].x - vector.x;
                point.y = startPoints[index].y - vector.y;
            });
        }
    }

    onUp(cursorPosition: Point): void {
        if(this.action) {
            this.action.details.endPoints = this.action.details.movedRoom.points;
        }
    }

    undo(): void {
        switch(this.action!!.type) {
            case "roomMove":
                const startPoints = this.action?.details.startPoints;
                this.action!!.details.movedRoom.points = startPoints;
                break;
        }
    }

    redo(): void {
        switch(this.action!!.type) {
            case "roomMove":
                const endPoints = this.action?.details.endPoints;
                this.action!!.details.movedRoom.points = endPoints;
                break;
        }
    }

    private getModifiedPosition(cursorPosition: Point) {
        const closeOrInlinePoint: Point | null = getCloseOrInLine(this.roomsData.getCurrentRoom(), this.roomsData.getRooms(), cursorPosition);
        return closeOrInlinePoint ? closeOrInlinePoint : cursorPosition;
    }
}