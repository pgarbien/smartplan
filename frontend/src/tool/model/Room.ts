import Point from './Point'

interface RoomInterface {
    name: string,
    color: string,
    points: Point[]
}

export default class Room implements RoomInterface {
    name: string;
    color: string;
    points: Point[];
    private highlighted: Boolean = false;

    constructor(name: string = "Pokój", color: string = "128, 128, 128", points: Point[] = []) {
        this.name = name;
        this.color = color;
        this.points = points;
    }

    setHighlighted(highlighted: Boolean) {
        this.highlighted = highlighted;
    }

    getHighlighted(): Boolean {
        return this.highlighted;
    }

    isHighlighted(): Boolean {
        return this.highlighted;
    }

    addPoint(point: Point) {
        this.points.push(point);
    }

    removePoint() {
        this.points.splice(this.points.length - 1, 1);
    }
}

export type { RoomInterface }