import {Injectable} from '@nestjs/common';
import {Repository} from "typeorm";
import {Level} from "./level.model";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class LevelService {
    constructor(@InjectRepository(Level) private levelRepository: Repository<Level>) {
    }

    getAllByLocationId(userId: string, locationId: number): Promise<Level[]> {
        return this.levelRepository.createQueryBuilder("level")
            .leftJoinAndSelect("level.rooms", "room")
            .where("level.userId = :userId and level.\"locationId\" = :locationId", {
                userId: userId,
                locationId: locationId
            })
            .getMany();
    }

    getById(userId: string, levelId: number): Promise<Level> {
        return this.levelRepository.findOne(
            {
                id: levelId,
                userId: userId
            },
            {
                relations: ["rooms"]
            })
    }

    persist(userId: string, level: Level): Promise<Level> {
        level.userId = userId;
        // level.rooms.forEach(room => {
        //     // room.userId = userId;
        //     room.level = level;
        // });
        return this.levelRepository.save(level);
    }

    deleteById(userId: string, levelId: number) {
        this.levelRepository.delete({
            "id": levelId,
            "userId": userId
        })

    }
}
