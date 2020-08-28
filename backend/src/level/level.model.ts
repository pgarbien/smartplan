import {Room} from "../room/room.model";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Location} from "../locations/location.model";

@Entity()
export class Level {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(
        type => Room,
        room => room.level,
        {
            cascade: true
        }
    )
    rooms: Room[];

    @Column()
    order: number;

    @ManyToOne(
        type => Location,
        location => location.levels
    )
    location: Location;

    constructor(name: string, rooms: Room[], order: number) {
        this.name = name;
        this.rooms = rooms;
        this.order = order;
    }
}
