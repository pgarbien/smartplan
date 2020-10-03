import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Level} from "../level/level.model";
import {Transform} from "class-transformer";

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
        level => level.rooms,
        {onDelete: "CASCADE", onUpdate: "CASCADE"}
    )
    @JoinColumn([
        {name: 'userId', referencedColumnName: 'userId'},
        {name: 'levelId', referencedColumnName: 'id'}
    ])
    level: Level;

    @Transform(points => JSON.parse(points))
    @Column()
    points: string;

    @Column()
    color: string;

    constructor(name: string, points: string, color: string) {
        this.name = name;
        this.points = points;
        this.color = color;
    }
}
