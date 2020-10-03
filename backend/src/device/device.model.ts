import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Exclude, Transform} from 'class-transformer';

@Entity()
export class Device {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn({unique: true})
    userId: string;

    @Column()
    @Exclude()
    suplaDeviceId: number;

    @Column()
    name: string;

    @Column({nullable: true})
    color: string;

    @Transform(point => JSON.parse(point))
    @Column({nullable: true})
    point: string;

    @Column({nullable: true})
    roomId: number;

    constructor(userId: string, suplaDeviceId: number, name: string, color: string, roomId: number) {
        this.userId = userId;
        this.suplaDeviceId = suplaDeviceId;
        this.name = name;
        this.color = color;
        this.roomId = roomId;
    }
}
