import Point from '../model/Point'
import Room from '../model/Room'

function getClosePoint(rooms: Room[], point: Point): Point | null {
    const closePoint = rooms
        .flatMap(room => room.points)
        .find(roomPoint => Math.abs(roomPoint.x - point.x) < 10 && Math.abs(roomPoint.y - point.y) < 10);

    return closePoint ? closePoint : null;
}

function getInLinePoints(rooms: Room[], point: Point): Point[] {
    const inLine = rooms
        .flatMap(room => room.points)
        .filter(roomPoint => roomPoint.x === point.x || roomPoint.y === point.y);

    return inLine;
}

function getCloseOrInLine(room: Room, rooms: Room[], point: Point) {
    const close = getClosePoint(rooms, point);

    if(close) {
        point.x = close.x;
        point.y = close.y;
    } else {
        //Line vertically or horizontally with previous point
        point.x = (Math.abs(room.points[room.points.length-1].x - point.x) < 10) ? room.points[room.points.length-1].x : point.x;
        point.y = (Math.abs(room.points[room.points.length-1].y - point.y) < 10) ? room.points[room.points.length-1].y : point.y;
        
        //Line vertically or horizontally with starting point
        point.x = (Math.abs(room.points[0].x - point.x) < 10) ? room.points[0].x : point.x;
        point.y = (Math.abs(room.points[0].y - point.y) < 10) ? room.points[0].y : point.y;
    }

    return point
}

// function highlightPoint(x: number, y: number) {
//     ctx!!.beginPath();
//     ctx!!.lineWidth = 1;
//     ctx!!.arc(x, y, 10, 0, 2 * Math.PI);
//     ctx!!.closePath();
//     ctx!!.stroke();
// }

export { getClosePoint, getInLinePoints, getCloseOrInLine }