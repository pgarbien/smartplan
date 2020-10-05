import Point from "./Point";

interface NewDeviceInterface {
    name: string;
    color: string,
    point: Point | null,
    radius: number,
    id: string,
}

export default class NewDevice implements NewDeviceInterface {
    name: string;
    color: string;
    id: string;
    point: Point | null;
    radius: number;

    constructor(name: string = "", color: string = "rgba(0, 209, 81, 1)", id: string = "null", point: Point | null = null, radius: number = 10) {
        this.name = name;
        this.color = color;
        this.id = id;
        this.point = point;
        this.radius = radius;
    }

    getCopy(): NewDevice {
        return new NewDevice(this.name, this.color, this.id, this.point!, this.radius);
    }

}

export type { NewDeviceInterface }