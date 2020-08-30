import {HttpService, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {Location} from "./location.model";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";

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

    getById(userId: string, id: number): Promise<Location> {
        return this.locationsRepository.findOne(
            {
                "id": id,
                "userId": userId
            },
            {
                relations: ["levels", "levels.rooms", "levels.rooms.points"]
            });
    }

    async persist(userId: string, location: Location): Promise<Location> {
        //TODO figure out a way of updating without delete
        location.userId = userId;
        // if(location.id != null){
        //     this.deleteById(userId, location.id);
        // }
        location.levels.forEach(location => {
            location.userId = userId;
            location.rooms.forEach(room => room.userId = userId)
        });
        return await this.locationsRepository.save(location);
    }

    deleteById(userId: string, locationId: number) {
        this.locationsRepository.delete({
            "id": locationId,
            "userId": userId
        })
    }

    async update(userId: string, location: Location): Promise<Location> {
        let existingLocation = await this.locationsRepository.findOne({
            "id": location.id,
            "userId": userId
        });

        location.levels.forEach(location => {
            location.userId = userId;
            location.rooms.forEach(room => room.userId = userId)
        });

        existingLocation = this.locationsRepository.merge(existingLocation, location);

        existingLocation.levels.forEach(location => {
            location.userId = userId;
            location.rooms.forEach(room => room.userId = userId)
        });

        console.log(JSON.stringify(existingLocation));

        return this.locationsRepository.save(existingLocation)
    }
}
