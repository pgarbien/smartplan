import Point from '../model/Point'
import Room from '../model/Room'
import Wall from '../model/Wall'
import NewDevice from '../model/NewDevice'

function getClosePoint(rooms: Room[], point: Point): Point | null {
    const closePoint = rooms
        .flatMap(room => room.points)
        .find(roomPoint => Math.abs(roomPoint.x - point.x) < 0.01 && Math.abs(roomPoint.y - point.y) < 0.01);

    return closePoint ? closePoint : null;
}

function getClosePointDevice(rooms: NewDevice[], point: Point): Point | null {
    
    const closePoint = rooms
        .filter(room => !!room.point)
        .flatMap(room => room.point)
        .find(roomPoint => Math.abs(roomPoint!.x - point.x) < 0.01 && Math.abs(roomPoint!.y - point.y) < 0.01);

    return closePoint ? closePoint : null;
}

//TODO refactor this function and functions used by it
function getCloseLine(rooms: Room[], point: Point): Wall | null {
    let minDistance = 0.01;
    let line: Wall | null = null;

    rooms.forEach(room => {
        const points = room.points;

        for(let i=0; i<points.length - 1; ++i) {
            const distance = Math.sqrt(distToSegmentSquared(point, points[i], points[i+1]));

            if(distance < minDistance) {
                line = new Wall(points[i], points[i+1]);
            }
        }
    });

    return line;
}

function distToSegmentSquared(point: Point, lineStart: Point, lineEnd: Point) {
    var l2 = dist2(lineStart, lineEnd);
    if (l2 === 0) return dist2(point, lineStart);
    var t = ((point.x - lineStart.x) * (lineEnd.x - lineStart.x) + (point.y - lineStart.y) * (lineEnd.y - lineStart.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return dist2(point, new Point(lineStart.x + t * (lineEnd.x - lineStart.x), lineStart.y + t * (lineEnd.y - lineStart.y) ));
}

function sqr(x: number) {
    return x * x;
}
  
function dist2 (startPoint: Point, endPoint: Point) {
    return sqr(startPoint.x - endPoint.x) + sqr(startPoint.y - endPoint.y);
}
  

function getInLinePoints(rooms: Room[], point: Point): Point[] {
    const inLine = rooms
        .flatMap(room => room.points)
        .filter(roomPoint => Math.abs(roomPoint.x - point.x) <= 0.0005 || Math.abs(roomPoint.y - point.y) <= 0.0005);

    return inLine;
}

function getCloseOrInLine(room: Room, rooms: Room[], point: Point) {
    const close = getClosePoint(rooms, point);

    if(close) {
        point.x = close.x;
        point.y = close.y;
    } else if(room.points.length > 0) {
        //Line vertically or horizontally with previous point
        point.x = (Math.abs(room.points[room.points.length-1].x - point.x) < 0.01) ? room.points[room.points.length-1].x : point.x;
        point.y = (Math.abs(room.points[room.points.length-1].y - point.y) < 0.01) ? room.points[room.points.length-1].y : point.y;

        //Line vertically or horizontally with starting point
        point.x = (Math.abs(room.points[0].x - point.x) < 0.01) ? room.points[0].x : point.x;
        point.y = (Math.abs(room.points[0].y - point.y) < 0.01) ? room.points[0].y : point.y;
    }

    return point
}

function getCloseOrInLineDevice(room: NewDevice, rooms: NewDevice[], point: Point) {
    const close = getClosePointDevice(rooms, point);
    
    if(close) {
        point.x = close.x;
        point.y = close.y;
    } else {
        if(room.point) {
            point.x = (Math.abs(room.point.x - point.x) < 0.01) ? room.point!.x : point.x;
            point.y = (Math.abs(room.point.y - point.y) < 0.01) ? room.point!.y : point.y;

            
            point.x = (Math.abs(room.point.x - point.x) < 0.01) ? room.point!.x : point.x;
            point.y = (Math.abs(room.point.y - point.y) < 0.01) ? room.point!.y : point.y;
        }
    }

    return point
}

export { getClosePoint, getInLinePoints, getCloseOrInLine, getCloseLine, getCloseOrInLineDevice, getClosePointDevice, }