import Room from '../model/Room'
import Point from '../model/Point'

function calculateRoomArea(room: Room): number {
    let totalArea = 0;
    const points = room.points;


    for (let i = 0, l = points.length; i < l; i++) {
        const addX = points[i].x;
        const addY = points[i === points.length - 1 ? 0 : i + 1].y;
        const subX = points[i === points.length - 1 ? 0 : i + 1].x;
        const subY = points[i].y;

        totalArea += (addX * addY * 0.5);
        totalArea -= (subX * subY * 0.5);
    }

    return Math.abs(totalArea);
}

function getPointedRoomIndex(point: Point, rooms: Room[]): number {
    for(let k=0; k<rooms.length; ++k) {
        let inside = false;
        const points = rooms[k].points;

        for (let i=0, j=points.length-1; i<points.length; j=i++) {
            var xi = points[i].x, yi = points[i].y;
            var xj = points[j].x, yj = points[j].y;

            var intersect = ((yi > point.y) !== (yj > point.y)) && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        if(inside) {
            return k;
        }
    }

    return -1;
};

function highlightRoom(rooms: Room[], index: number) {
    dehighlight(rooms);

    rooms[index].setHighlighted(true);
}

function dehighlight(rooms: Room[]) {
    rooms.forEach(room => {
        room.setHighlighted(false);
    });
}

export { calculateRoomArea, getPointedRoomIndex, highlightRoom, dehighlight }