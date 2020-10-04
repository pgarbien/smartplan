import {Room} from "../room/room.model";
import {Column, Entity} from "typeorm";

@Entity()
export class Level {
    @Column()
    id: string;

    @Column()
    userId: string;

    @Column()
    name: string;

    @Column({nullable: true})
    blueprintUrl: string;

    @Column(type => Room)
    rooms: Room[];

    @Column()
    order: number;

    constructor(name: string, rooms: Room[], order: number) {
        this.name = name;
        this.rooms = rooms;
        this.order = order;
    }
}

