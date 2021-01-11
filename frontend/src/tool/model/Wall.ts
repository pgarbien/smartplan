import Point from "./Point";

interface WallInterface {
    start: Point,
    end: Point
}

export default class Wall implements WallInterface {
    start: Point;
    end: Point;

    constructor(start: Point, end: Point) {
        this.start = start;
        this.end = end;
    }

    getCopy(): Wall {
        const newStart: Point = this.start.getCopy();
        const newEnd: Point = this.end.getCopy();

        return new Wall(newStart, newEnd);
    }
}