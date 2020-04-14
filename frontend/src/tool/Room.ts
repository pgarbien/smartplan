import { Point } from './Point'

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

    constructor(name: string, color: string, points: Point[]) {
        this.name = name;
        this.color = color;
        this.points = points;
    }

    setHighlighted(highlighted: Boolean) {
        this.highlighted = highlighted;
    }

    isHighlighted(): Boolean {
        return this.highlighted;
    }
}

export type { RoomInterface }