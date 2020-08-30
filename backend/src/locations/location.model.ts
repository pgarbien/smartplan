import {Level} from "../level/level.model";
import {Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";


@Entity()
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn({unique: true})
    userId: string;

    @Column()
    name: string;

    @Column({nullable: true})
    photoUrl: string;

    @OneToMany(
        type => Level,
        level => level.location,
        {cascade: true, onUpdate: "CASCADE"}
    )
    levels: Level[];

    constructor(userId: string, name: string, levels: Level[]) {
        this.userId = userId;
        this.name = name;
        this.levels = levels;
    }
}
