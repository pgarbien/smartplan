import { Injectable } from '@nestjs/common';
import {Repository} from "typeorm";
import {Room} from "./room.model";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class RoomService {
    constructor(@InjectRepository(Room) private roomRepository: Repository<Room>) {}

    save(room: Room): Promise<Room> {
        return this.roomRepository.save(room);
    }
}
