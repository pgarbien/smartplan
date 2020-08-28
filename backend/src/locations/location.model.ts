import {Level} from "../level/level.model";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(
        type => Level,
        level => level.location,
        {cascade: true}
    )
    levels: Level[];

    constructor(name: string, levels: Level[]) {
        this.name = name;
        this.levels = levels;
    }
}
