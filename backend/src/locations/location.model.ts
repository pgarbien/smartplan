import {Level} from "../level/level.model";
import {Column, Entity, ObjectID, ObjectIdColumn, OneToMany, PrimaryColumn} from "typeorm";
import {Transform} from "class-transformer";


@Entity()
export class Location {
    @Transform(id => id.toString())
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    userId: string;

    @Column()
    name: string;

    @Column({nullable: true})
    photoUrl: string;

    @Column(type => Level)
    levels: Level[];

    constructor(userId: string, name: string, levels: Level[]) {
        this.userId = userId;
        this.name = name;
        this.levels = levels;
    }
}
