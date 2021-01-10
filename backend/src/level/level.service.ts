import {Injectable} from '@nestjs/common';
import {MongoRepository, Repository} from "typeorm";
import {Level} from "./level.model";
import {InjectRepository} from "@nestjs/typeorm";
import {DeviceService} from "../device/device.service";

@Injectable()
export class LevelService {
    constructor(@InjectRepository(Level) private readonly levelRepository: MongoRepository<Level>,
                private readonly deviceService: DeviceService) {
    }

    public getAllByLocationId(userId: string, locationId: number): Promise<Level[]> {
        return this.levelRepository.createQueryBuilder("level")
            .leftJoinAndSelect("level.rooms", "room")
            .where("level.userId = :userId and level.\"locationId\" = :locationId", {
                userId: userId,
                locationId: locationId
            })
            .getMany();
    }

    public getById(userId: string, levelId: string): Promise<Level> {
        return this.levelRepository.findOne(
            {
                id: levelId,
                userId: userId
            })
    }

    public persist(userId: string, level: Level): Promise<Level> {
        level.userId = userId;
        return this.levelRepository.save(level);
    }

    public deleteById(userId: string, levelId: string) {
        this.deviceService.removeAllFromLevel(userId, levelId);
        this.levelRepository.delete({
            "id": levelId,
            "userId": userId
        });
    }
}
