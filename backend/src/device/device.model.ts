import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Room} from "src/room/room.model";
import {Point} from "../model/point.model";

@Entity()
export class Device {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn({unique: true})
    userId: string;

    @Column()
    suplaDeviceId: number;

    @Column()
    name: string;

    @Column({nullable: true})
    color: string;

    @Column({nullable: true})
    point: string;

    @ManyToOne(
        type => Room
    )
    @JoinColumn([
        {name: 'userId', referencedColumnName: 'userId'},
        {name: 'roomId', referencedColumnName: 'id'}
    ])
    room: Room;


    constructor(userId: string, suplaDeviceId: number, name: string, color: string, room: Room) {
        this.userId = userId;
        this.suplaDeviceId = suplaDeviceId;
        this.name = name;
        this.color = color;
        this.room = room;
    }
}
