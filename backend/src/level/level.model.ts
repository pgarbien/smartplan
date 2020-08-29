import {Room} from "../room/room.model";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Location} from "../locations/location.model";

@Entity()
export class Level {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn({unique: true})
    userId: string;

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
        // , { primary: true }
    )
    @JoinColumn([
        {name: 'userId', referencedColumnName: 'userId'},
        {name: 'locationId', referencedColumnName: 'id'}
    ])
    location: Location;

    constructor(name: string, rooms: Room[], order: number) {
        this.name = name;
        this.rooms = rooms;
        this.order = order;
    }
}

