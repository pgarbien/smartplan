import {Point} from "../model/point.model";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Level} from "../level/level.model";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn({unique: true})
    userId: string;

    @Column()
    name: string;


    @ManyToOne(
        type => Level,
        level => level.rooms
        // , { primary: true }
    )
    @JoinColumn([
        {name: 'userId', referencedColumnName: 'userId'},
        {name: 'levelId', referencedColumnName: 'id'}
    ])
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
