import Point from "./Point";

export enum DeviceState {
    ACTIVE,
    NOT_ACTIVE,
    DISABLED
}

interface NewDeviceInterface {
    name: string,
    id: string,
    point: Point | null,
    icons: string[] | null,
    activeIconId: number | null,
    defaultAction: number | null,
    roomId: string | null,
    locationId: string | null,
    levelId: string | null,
    deviceState: DeviceState | null,
    displayedState: String | null
}

export default class NewDevice implements NewDeviceInterface {
    name: string;
    id: string;
    point: Point | null;
    icons: string[] | null;
    activeIconId: number | null;
    defaultAction: number | null;
    roomId: string | null;
    locationId: string | null;
    levelId: string | null;
    deviceState: DeviceState | null;
    displayedState: String | null;

    constructor(
        name: string = "", 
        id: string = "null", 
        point: Point | null = null, 
        icons: string[] | null = null, 
        activeIconId: number | null = null, 
        defaultAction: number | null = null, 
        roomId: string | null = null, 
        locationId: string | null = null, 
        levelId: string | null = null,
        deviceState: DeviceState | null = null,
        displayedState: String | null = null
    ) {
        this.name = name;
        this.id = id;
        this.point = point;
        this.icons = icons;
        this.activeIconId = activeIconId;
        this.defaultAction = defaultAction;
        this.roomId = roomId;
        this.locationId = locationId;
        this.levelId = levelId;
        this.deviceState = deviceState;
        this.displayedState = displayedState;
    }

    getCopy(): NewDevice {
        return new NewDevice(this.name, this.id, this.point, this.icons, this.activeIconId, this.defaultAction, this.roomId, this.locationId, this.levelId, this.deviceState, this.displayedState);
    }

}

export type { NewDeviceInterface }