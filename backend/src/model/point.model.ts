import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Room} from "../room/room.model";

@Entity()
export class Point {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("real")
    x: number;

    @Column("real")
    y: number;

    @PrimaryColumn({unique: true})
    userId: string;


    @ManyToOne(
        type => Room,
        room => room.points,
        { onDelete: "CASCADE", onUpdate: "CASCADE" }
    )
    @JoinColumn([
        {name: 'userId', referencedColumnName: 'userId'},
        {name: 'roomId', referencedColumnName: 'id'}
    ])
    room: Room;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
