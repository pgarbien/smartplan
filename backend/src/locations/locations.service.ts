import {HttpService, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {Location} from "./location.model";
import {Repository, UpdateResult} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {randomStringGenerator} from "@nestjs/common/utils/random-string-generator.util";

@Injectable()
export class LocationsService {
    constructor(private readonly configService: ConfigService,
                private readonly httpService: HttpService,
                @InjectRepository(Location) private readonly locationsRepository: Repository<Location>) {
    }

    private apiKey: string = this.configService.get<string>('API_KEY');
    private apiUrl = this.configService.get<string>('API_URL') + '/channels';

    private config = {
        headers: {Authorization: `Bearer ${this.apiKey}`}
    };

    // getLocations() {
    //     return this.httpService.get(this.apiUrl, this.config)
    //         .pipe(
    //             map(response => response.data)
    //         );
    // }
    //
    // getLocationById(locationId: number) {
    //     return this.httpService.get(this.apiUrl + `/${locationId}`)
    //         .pipe(
    //             map(response => response.data)
    //         );
    // }

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
                // room.points = JSON.stringify(room.points);
            })
        });
        return await this.locationsRepository.save(location);
    }

    deleteById(userId: string, locationId: string) {
        this.locationsRepository.delete({
            "id": locationId,
            "userId": userId
        })
    }

    async update(userId: string, location: Location): Promise<UpdateResult> {
        location.levels.forEach(level => {
            if(level.id  == null) {
                level.userId = userId;
                level.id = randomStringGenerator();
            }
            level.rooms.forEach(room => {
                if(room.id == null) {
                    room.userId = userId;
                    room.id = randomStringGenerator();
                }
                // room.points = JSON.stringify(room.points);
            })
        });
        return await this.locationsRepository.update(location.id, location);
    }
}
