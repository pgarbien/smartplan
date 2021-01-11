import Room from './model/Room'

export default class CreatorRooms {
    private rooms: Room[] = [];
    private currentRoom: Room = new Room();

    getRooms() {
        return this.rooms;
    }

    setRooms(rooms: Room[]) {
        this.rooms = rooms;
    }

    getCurrentRoom() {
        return this.currentRoom;
    }

    setCurrentRoom(room: Room) {
        this.currentRoom = room;
    }
}