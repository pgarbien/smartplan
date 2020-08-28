import Level from './Level'

interface LocationInterface {
    id: number,
    name: string,
    levels: Level[]
}

export default class Location implements LocationInterface {
    id: number;
    name: string;
    levels: Level[];

    constructor(id: number, name: string, levels: Level[]) {
        this.id = id;
        this.name = name;
        this.levels = levels;
    }

    getCopy(): Location {
        return new Location(this.id, this.name, this.levels);
    }
}