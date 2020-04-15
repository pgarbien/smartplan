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

    constructor(name: string = "Pokój", color: string = "128, 128, 128", points: Point[] = []) {
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

    addLastPoint(point: Point) {
        this.points.push(point);
    }

    removeLastPoint() {
        this.points.splice(this.points.length - 1, 1);
    }

    calculateArea() {
        var totalArea = 0;
    
        for (var i = 0, l = this.points.length; i < l; i++) {
            var addX = this.points[i].x;
            var addY = this.points[i === this.points.length - 1 ? 0 : i + 1].y;
            var subX = this.points[i === this.points.length - 1 ? 0 : i + 1].x;
            var subY = this.points[i].y;
    
            totalArea += (addX * addY * 0.5);
            totalArea -= (subX * subY * 0.5);
        }
    
        return Math.abs(totalArea);
    }
}

export type { RoomInterface }