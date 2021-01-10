import {Room} from "../room/room.model";
import {Column, Entity} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {Exclude} from "class-transformer";

@Entity()
export class Level {
    @ApiProperty()
    @Column()
    id: string;

    @Column()
    @Exclude()
    userId: string;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty({
        required: false
    })
    @Column({
        nullable: true
    })
    blueprintUrl: string;

    @ApiProperty({
        type: () => [Room]
    })
    @Column(() => Room)
    rooms: Room[];

    @ApiProperty()
    @Column()
    order: number;

    constructor(name: string, rooms: Room[], order: number) {
        this.name = name;
        this.rooms = rooms;
        this.order = order;
    }
}

