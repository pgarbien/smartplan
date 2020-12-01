import {Column, Entity, PrimaryColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {Exclude} from "class-transformer";

@Entity()
export class Room {
    @ApiProperty()
    @PrimaryColumn()
    id: string;

    @Exclude()
    @Column()
    userId: string;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    points: JSON;

    @ApiProperty({
        required: false
    })
    @Column()
    color: string;

    constructor(name: string, points: JSON, color: string) {
        this.name = name;
        this.points = points;
        this.color = color;
    }
}
