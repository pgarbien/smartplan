import {Point} from "../model/point.model";
import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Level} from "../level/level.model";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToOne(
        type => Level,
        level => level.rooms
    )
    level: Level;

    @OneToMany(
        type => Point,
        point => point.room,
        {
            cascade: true
        }
    )
    points: Point[];

    @Column()
    color: string;

    constructor(name: string, points: Point[], color: string) {
        this.name = name;
        this.points = points;
        this.color = color;
    }
}
