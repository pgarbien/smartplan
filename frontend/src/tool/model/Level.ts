import Room from './Room'

interface LevelInterface {
    id: number,
    name: string,
    blueprintUrl: string,
    rooms: Room[],
    order: number,
}

export default class Level implements LevelInterface {
    id: number;
    name: string;
    blueprintUrl: string;
    rooms: Room[];
    order: number;

    constructor(id: number, name: string, blueprintUrl: string, rooms: Room[], order: number) {
        this.id = id;
        this.name = name;
        this.blueprintUrl = blueprintUrl;
        this.rooms = rooms;
        this.order = order;
    }

    getCopy(): Level {
        return new Level(this.id, this.name, this.blueprintUrl, this.rooms, this.order);
    }
}