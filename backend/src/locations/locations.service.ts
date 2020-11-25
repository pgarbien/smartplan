import {Injectable} from '@nestjs/common';
import {Location} from "./location.model";
import {MongoRepository, UpdateResult} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {randomStringGenerator} from "@nestjs/common/utils/random-string-generator.util";
import {DeviceService} from "../device/device.service";

@Injectable()
export class LocationsService {
    constructor(@InjectRepository(Location) private readonly locationsRepository: MongoRepository<Location>,
                private readonly deviceService: DeviceService) {
    }

    public getAll(userId: string): Promise<Location[]> {
        return this.locationsRepository.find({"userId": userId});
    }

    public getById(userId: string, id: string): Promise<Location> {
        return this.locationsRepository.findOne(id, {
            where: {"userId": userId}
        });
    }

    public async persist(userId: string, location: Location): Promise<Location> {
        location.userId = userId;
        location.levels.forEach(level => {
            level.userId = userId;
            level.id = randomStringGenerator();
            level.rooms.forEach(room => {
                room.userId = userId;
                room.id = randomStringGenerator();
            })
        });
        return await this.locationsRepository.save(location);
    }

    public async update(userId: string, location: Location): Promise<UpdateResult> {
        const dbLocationLevels = (await this.locationsRepository.findOne(location.id, {
            where: {userId: userId}
        })).levels.map(level => level.id);

        location.levels.forEach(level => {
            if (level.id == null) {
                level.userId = userId;
                level.id = randomStringGenerator();
            }
            level.rooms.forEach(room => {
                if (room.id == null) {
                    room.userId = userId;
                    room.id = randomStringGenerator();
                }
            })
        });

        dbLocationLevels.forEach(levelId => {
            if(!location.levels.map(level => level.id).includes(levelId))
                this.deviceService.removeAllFromLevel(userId, levelId);}
        );
        return await this.locationsRepository.update(location.id, location);
    }

    public deleteById(userId: string, locationId: string) {
        this.deviceService.removeAllFromLocation(userId, locationId);
        this.locationsRepository.deleteOne({
            "id": locationId,
            "userId": userId
        });
    }
}
