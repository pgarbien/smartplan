import {Controller, Get} from '@nestjs/common';
import {RoomService} from "./room.service";

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {
    }

    @Get()
    async add() {
        // const  room: Room = await this.roomService.save({id: 0, name: "aa", color: "asasa", points: [], level: null})
    }
}
