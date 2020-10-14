import {Injectable} from '@nestjs/common';
import {MongoRepository, Repository} from "typeorm";
import {Level} from "./level.model";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class LevelService {
    constructor(@InjectRepository(Level) private levelRepository: MongoRepository<Level>) {
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

    getById(userId: string, levelId: string): Promise<Level> {
        return this.levelRepository.findOne(
            {
                id: levelId,
                userId: userId
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

    deleteById(userId: string, levelId: string) {
        this.levelRepository.delete({
            "id": levelId,
            "userId": userId
        })

    }
}
