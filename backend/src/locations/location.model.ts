import {Level} from "../level/level.model";
import {Column, Entity, ObjectID, ObjectIdColumn, OneToMany, PrimaryColumn} from "typeorm";
import {Exclude, Transform} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";


@Entity()
export class Location {
    @ApiProperty({type: () => String})
    @Transform(id => id.toString())
    @ObjectIdColumn()
    id: ObjectID;

    @Exclude()
    @Column()
    userId: string;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty({
        required: false
    })
    @Column({nullable: true})
    photoUrl: string;

    @ApiProperty({
        type: () => [Level]
    })
    @Column(() => Level)
    levels: Level[];

    constructor(userId: string, name: string, levels: Level[]) {
        this.userId = userId;
        this.name = name;
        this.levels = levels;
    }
}
