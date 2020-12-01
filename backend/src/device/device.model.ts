import {Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Exclude, Transform} from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export interface BaseDevice {
    suplaIconId: number;
    icons: string[];
    defaultAction: ActionType;
    type: DeviceType;
    possibleVisualStates: string[];
}

@Entity()
export class Device implements BaseDevice {
    @ApiProperty({type: () => String})
    @Transform(id => id.toString())
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    userId: string;

    @Column()
    @Exclude()
    suplaDeviceId: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column({nullable: true})
    color: string;

    @ApiProperty()
    @Column({nullable: true})
    point: JSON;

    @ApiProperty({
        required: false
    })
    @Column({nullable: true})
    roomId: string;

    @ApiProperty({
        required: false
    })
    @Column({nullable: true})
    locationId: string;

    @ApiProperty({
        required: false
    })
    @Column({nullable: true})
    levelId: string;

    @Exclude()
    @Column({nullable: true})
    suplaIconId: number;

    @ApiProperty()
    @Column({nullable: true})
    icons: string[];

    @ApiProperty()
    @Column()
    defaultAction: ActionType;

    @ApiProperty()
    @Column({nullable: true})
    possibleVisualStates: string[];

    @ApiProperty()
    @Column({nullable: true})
    type: DeviceType;

    constructor(userId: string, suplaDeviceId: number, name: string, suplaIconId: number, type: DeviceType, possibleVisualStates: string[]) {
        this.userId = userId;
        this.suplaDeviceId = suplaDeviceId;
        this.name = name;
        this.suplaIconId = suplaIconId;
        this.type = type;
        this.possibleVisualStates = possibleVisualStates;
    }
}

export class DeviceDetails implements BaseDevice {
    @ApiProperty()
    type: DeviceType;

    @ApiProperty()
    caption: string;

    @ApiProperty()
    actions: Action[];

    @ApiProperty()
    state: JSON;

    @Exclude()
    suplaIconId: number;

    @ApiProperty()
    icons: string[];

    @ApiProperty()
    defaultAction: ActionType;

    @ApiProperty()
    possibleVisualStates: string[];

    constructor(type: DeviceType, caption: string, actions: Action[], state: any, suplaIconId: DeviceType, possibleVisualStates: string[]) {
        this.type = type;
        this.caption = caption;
        this.actions = actions;
        this.state = state;
        this.suplaIconId = suplaIconId;
        this.possibleVisualStates = possibleVisualStates;
    }
}
//TODO analyze states and make model for them

export class DeviceState {
    @ApiProperty()
    id: string;

    @ApiProperty()
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
    @ApiProperty()
    name: ActionType;

    @ApiProperty()
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

export interface DeviceConfig {
    images: string[];
    defaultAction: ActionType;
}
