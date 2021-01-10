interface PointInterface {
    x: number,
    y: number
}

export default class Point implements PointInterface {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    getCopy(): Point {
        return new Point(this.x, this.y);
    }
}