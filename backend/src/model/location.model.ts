import {Level} from "./level.model";



export class Location {
    id: number;
    name: string;
    levels: Level[];

    constructor(id: number, name: string, levels: Level[]) {
        this.id = id;
        this.name = name;
        this.levels = levels;
    }
}
