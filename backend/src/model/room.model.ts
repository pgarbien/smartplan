import {Point} from "./point.model";

export class Room {
    id: number;
    name: string;
    points: Point[];
    color: string;

    constructor(id: number, name: string, points: Point[], color: string) {
        this.id = id;
        this.name = name;
        this.points = points;
        this.color = color;
    }
}
