import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class Room {
    @PrimaryColumn()
    id: string;

    @Column()
    userId: string;

    @Column()
    name: string;

    @Column()
    points: JSON;

    @Column()
    color: string;

    constructor(name: string, points: JSON, color: string) {
        this.name = name;
        this.points = points;
        this.color = color;
    }
}
