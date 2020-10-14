import {Injectable} from '@nestjs/common';
import {Location} from "./location.model";
import {MongoRepository, UpdateResult} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {randomStringGenerator} from "@nestjs/common/utils/random-string-generator.util";

@Injectable()
export class LocationsService {
    constructor(@InjectRepository(Location) private readonly locationsRepository: MongoRepository<Location>) {
    }

    getAll(userId: string): Promise<Location[]> {
        return this.locationsRepository.find({"userId": userId});
    }

    getById(userId: string, id: string): Promise<Location> {
        return this.locationsRepository.findOne(id, {
            where: {"userId": userId}
        });
    }

    async persist(userId: string, location: Location): Promise<Location> {
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

    deleteById(userId: string, locationId: string) {
        this.locationsRepository.deleteOne({
            "id": locationId,
            "userId": userId
        })
    }

    async update(userId: string, location: Location): Promise<UpdateResult> {
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
                // room.points = JSON.stringify(room.points);
            })
        });
        return await this.locationsRepository.update(location.id, location);
    }
}
