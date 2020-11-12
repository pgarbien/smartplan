import Point from "./Point";

interface NewDeviceInterface {
    name: string;
    color: string,
    point: Point | null,
    icons: string[] | null,
    defaultAction: number | null,
    id: string,
    roomId: string | null,
    locationId: string | null,
    levelId: string | null
}

export default class NewDevice implements NewDeviceInterface {
    name: string;
    color: string;
    id: string;
    point: Point | null;
    icons: string[] | null;
    defaultAction: number | null;
    roomId: string | null;
    locationId: string | null;
    levelId: string | null;

    constructor(name: string = "", color: string = "rgba(0, 209, 81, 1)", id: string = "null", point: Point | null = null, icons: string[] | null = null, defaultAction: number | null = null, roomId: string | null = null, locationId: string | null = null, levelId: string | null = null) {
        this.name = name;
        this.color = color;
        this.id = id;
        this.point = point;
        this.icons = icons;
        this.defaultAction = defaultAction;
        this.roomId = roomId;
        this.locationId = locationId;
        this.levelId = levelId;
    }

    getCopy(): NewDevice {
        return new NewDevice(this.name, this.color, this.id, this.point, this.icons, this.defaultAction, this.roomId, this.locationId, this.levelId);
    }

}

export type { NewDeviceInterface }