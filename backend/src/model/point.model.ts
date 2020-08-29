import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Room} from "../room/room.model";

@Entity()
export class Point {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("real")
    x: number;

    @Column("real")
    y: number;

    @ManyToOne(
        type => Room,
        room => room.points,
        { onDelete: "CASCADE", onUpdate: "CASCADE" }
    )
    room: Room;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
