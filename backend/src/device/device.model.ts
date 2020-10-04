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

    constructor(userId: string, suplaDeviceId: number, name: string, color: string, roomId: string) {
        this.userId = userId;
        this.suplaDeviceId = suplaDeviceId;
        this.name = name;
        this.color = color;
        this.roomId = roomId;
    }
}
