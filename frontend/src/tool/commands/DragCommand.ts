import Command from './Command';
import Point from '../model/Point';
import Wall from '../model/Wall';
import Room from '../model/Room';
import CreatorRooms from '../CreatorRooms';
import { getPointedRoomIndex, highlightRoom, dehighlight } from '../utils/RoomUtils';
import { getClosePoint, getCloseOrInLine, getCloseLine } from '../utils/DrawingUtils';
import CanvasDrawer from '../CanvasDrawer';

export default class DragCommand extends Command {
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
        const position = this.getModifiedPosition(cursorPosition);
        const pointedRoomIndex = getPointedRoomIndex(position, this.roomsData.getRooms());
        const closePoint: Point | null = getClosePoint(this.roomsData.getRooms(), cursorPosition);
        const closeLine = getCloseLine(this.roomsData.getRooms(), cursorPosition);

        dehighlight(this.roomsData.getRooms());
        if(closePoint) {
            this.canvasDrawer.highlightPoint(closePoint);
        } else if(closeLine) {
            this.canvasDrawer.highlightLine(closeLine.start, closeLine.end);
        } else if (pointedRoomIndex > 0) {
            highlightRoom(this.roomsData.getRooms(), pointedRoomIndex);
        }
    }

    onDown(cursorPosition: Point): void {
        const position = this.getModifiedPosition(cursorPosition);
        const pointedRoomIndex = getPointedRoomIndex(position, this.roomsData.getRooms());
        const closePoint: Point | null = getClosePoint(this.roomsData.getRooms(), cursorPosition);
        const closeLine: Wall | null = getCloseLine(this.roomsData.getRooms(), cursorPosition);
        
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
        } else if(closeLine) {
            const previousWall: Wall = closeLine.getCopy();
            
            this.action = {
                type: "wallMove",
                cursorPosition: cursorPosition,
                details: {
                    movedWall: closeLine,
                    startWall: previousWall
                }
            }
        } else if (pointedRoomIndex > 0) {
            const pointedRoom = this.roomsData.getRooms()[pointedRoomIndex];

            const previousPoints = pointedRoom.points;
            const newPoints: Point[] = [];
            previousPoints.forEach((point: Point) => {
                newPoints.push(point.getCopy())
            });

            //Otherwise pointMove undo doesn't work (reference has to be maintained)
            pointedRoom.points = newPoints;
            
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
        const position = this.getModifiedPosition(cursorPosition);
        if(this.action) {
            const horizontalDelta: number = position.x - this.action.cursorPosition.x;
            const verticalDelta: number = position.y - this.action.cursorPosition.y;
            const vector: Point = new Point(horizontalDelta, verticalDelta);

            if(this.action.type === "pointMove") {
                const movedPoint: Point = this.action.details.movedPoint;
                const startPoint: Point = this.action.details.startPoint;

                movedPoint.x = startPoint.x + vector.x;
                movedPoint.y = startPoint.y + vector.y;
            } else if(this.action.type === "wallMove") {
                const movedWall: Wall = this.action.details.movedWall;
                const startWall: Wall = this.action.details.startWall;
                
                movedWall.start.x = startWall.start.x + vector.x;
                movedWall.end.x = startWall.end.x + vector.x;
                movedWall.start.y = startWall.start.y + vector.y;
                movedWall.end.y = startWall.end.y + vector.y;
            } else if(this.action.type === "roomMove") {
                const movedRoom: Room = this.action.details.movedRoom;
                const startPoints: Point[] = this.action.details.startPoints;

                movedRoom.points.forEach((point, index) => {
                    point.x = startPoints[index].x + vector.x;
                    point.y = startPoints[index].y + vector.y;
                });
            }   
        }
    }

    onUp(cursorPosition: Point): void {
        if(this.action) {
            if(this.action.type === "pointMove") {
                const endPoint: Point = this.action.details.movedPoint.getCopy();

                this.action.details.endPoint = endPoint;
            } else if(this.action.type === "wallMove") {
                const movedWall: Wall = this.action.details.movedWall
                const endWall: Wall = movedWall.getCopy();

                this.action.details.endWall = endWall;
            } else if(this.action.type === "roomMove") {
                this.action.details.endPoints = this.action.details.movedRoom.points;
            }
        }
    }

    undo(): void {
        switch(this.action!!.type) {
            case "pointMove":
                const startPoint = this.action?.details.startPoint;

                this.action!!.details.movedPoint.x = startPoint.x;
                this.action!!.details.movedPoint.y = startPoint.y;
                break;
            case "wallMove":
                const startWall = this.action?.details.startWall;

                this.action!!.details.movedWall.start.x = startWall.start.x;
                this.action!!.details.movedWall.start.y = startWall.start.y;
                this.action!!.details.movedWall.end.x = startWall.end.x;
                this.action!!.details.movedWall.end.y = startWall.end.y;
                break;
            case "roomMove":
                const startPoints = this.action?.details.startPoints;
                this.action!!.details.movedRoom.points = startPoints;
                break;
        }
    }

    redo(): void {
        switch(this.action!!.type) {
            case "pointMove":
                const endPoint = this.action?.details.endPoint;

                this.action!!.details.movedPoint.x = endPoint.x;
                this.action!!.details.movedPoint.y = endPoint.y;
                break;
            case "wallMove":
                const endWall = this.action?.details.endWall;

                this.action!!.details.movedWall.start.x = endWall.start.x;
                this.action!!.details.movedWall.start.y = endWall.start.y;
                this.action!!.details.movedWall.end.x = endWall.end.x;
                this.action!!.details.movedWall.end.y = endWall.end.y;
                break;
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