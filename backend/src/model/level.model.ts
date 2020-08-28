import {Room} from "./room.model";

export class Level {
    private id: number;
    private name: string;
    private rooms: Room[];
    private order: number;

    constructor(id: number, name: string, rooms: Room[], order: number) {
        this.id = id;
        this.name = name;
        this.rooms = rooms;
        this.order = order;
    }
}
