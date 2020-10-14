import {Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Exclude, Transform} from 'class-transformer';

@Entity()
export class Device {
    @Transform(id => id.toString())
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    userId: string;

    @Column()
    @Exclude()
    suplaDeviceId: number;

    @Column()
    name: string;

    @Column({nullable: true})
    color: string;

    @Column({nullable: true})
    point: JSON;

    @Column({nullable: true})
    roomId: string;

    @Column({nullable: true})
    locationId: string;

    @Column({nullable: true})
    levelId: string;

    constructor(userId: string, suplaDeviceId: number, name: string, color: string, roomId: string) {
        this.userId = userId;
        this.suplaDeviceId = suplaDeviceId;
        this.name = name;
        this.color = color;
        this.roomId = roomId;
    }
}

export class DeviceDetails {
    type: DeviceType;
    caption: string;
    actions: Action[];
    state: JSON;

    constructor(type: DeviceType, caption: string, actions: Action[], state: any) {
        this.type = type;
        this.caption = caption;
        this.actions = actions;
        this.state = state;
    }
}
//TODO analyze states and make model for them

export class DeviceState {
    id: string;
    state: JSON;


    constructor(id: string, state: JSON) {
        this.id = id;
        this.state = state;
    }
}

export enum DeviceType {
    NONE, CONTROLLINGTHEGATEWAYLOCK, CONTROLLINGTHEGATE, CONTROLLINGTHEGARAGEDOOR,
    THERMOMETER, HUMIDITY, HUMIDITYANDTEMPERATURE, OPENINGSENSOR_GATEWAY,
    OPENINGSENSOR_GATE, OPENINGSENSOR_GARAGEDOOR, NOLIQUIDSENSOR,
    CONTROLLINGTHEDOORLOCK, OPENINGSENSOR_DOOR, CONTROLLINGTHEROLLERSHUTTER,
    OPENINGSENSOR_ROLLERSHUTTER, POWERSWITCH, LIGHTSWITCH, DIMMER,
    RGBLIGHTING, DIMMERANDRGBLIGHTING, DEPTHSENSOR, DISTANCESENSOR,
    OPENINGSENSOR_WINDOW, MAILSENSOR, WINDSENSOR, PRESSURESENSOR,
    RAINSENSOR, WEIGHTSENSOR, WEATHER_STATION, STAIRCASETIMER
}
export class Action {
    name: ActionType;
    caption: string;


    constructor(name: ActionType, caption: string) {
        this.name = name;
        this.caption = caption;
    }
}

export enum ActionType {
    OPEN, CLOSE, SHUT, REVEAL, REVEAL_PARTIALLY,
    TURN_ON, TURN_OFF, SET_RGBW_PARAMETERS, OPEN_CLOSE,
    STOP, TOGGLE, READ
}
