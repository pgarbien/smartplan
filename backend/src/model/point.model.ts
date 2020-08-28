import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Room} from "../room/room.model";

@Entity()
export class Point {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    x: number;

    @Column()
    y: number;

    @ManyToOne(
        type => Room,
        room => room.points
    )
    room: Room;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
