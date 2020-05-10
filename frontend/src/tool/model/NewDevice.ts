import Point from "./Point";

interface NewDeviceInterface {
    color: string,
    point: Point,
    radius: number
}

export default class NewDevice implements NewDeviceInterface {
    color: string;
    point: Point;
    radius: number;

    constructor(color: string = "128, 128, 128",point: Point = new Point(150,150), radius: number = 10) {
        this.color = color;
        this.point = point;
        this.radius = radius;
    }

    getCopy(): NewDevice {
        return new NewDevice(this.color, this.point, this.radius);
    }

}

export type { NewDeviceInterface }