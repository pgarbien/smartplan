import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Room } from "src/room/room.model";

@Entity()
export class NewDevice {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn({unique: true})
    userId: string;

    @Column()
    name: string;

    @Column()
    color: string;

    @ManyToOne(
        type => Room,
        room => room.devices,
        {onDelete: "CASCADE", onUpdate: "CASCADE"}
    )
    @JoinColumn([
        {name: 'userId', referencedColumnName: 'userId'},
        {name: 'roomId', referencedColumnName: 'id'}
    ])
    room: Room;

    constructor(name: string) {
        this.name = name;
    }
}