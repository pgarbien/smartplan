import {HttpService, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {Level} from "../level/level.model";
import {Room} from "../room/room.model";
import {Location} from "./location.model";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Point} from "../model/point.model";

@Injectable()
export class LocationsService {
    constructor(private configService: ConfigService,
                private httpService: HttpService,
                @InjectRepository(Location) private locationsRepository: Repository<Location>) {

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
        console.log('userId: ' + userId);
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

    public rooms: Room[] = [
        {
            "name": "Metr kwadratowy",
            "color": "128, 128, 128",
            "points": [
                {
                    "x": 590,
                    "y": 590
                } as Point,
                {
                    "x": 540,
                    "y": 590
                } as Point,
                {
                    "x": 540,
                    "y": 540
                } as Point,
                {
                    "x": 590,
                    "y": 540
                } as Point
            ]
        } as Room,
        {
            "name": "Sypialnia",
            "color": "128, 128, 128",
            "points": [
                {
                    "x": 146,
                    "y": 303
                } as Point,
                {
                    "x": 146,
                    "y": 160
                } as Point,
                {
                    "x": 262,
                    "y": 160
                } as Point,
                {
                    "x": 262,
                    "y": 303
                } as Point
            ]
        } as Room,
        {
            "name": "Salon",
            "color": "128, 128, 128",
            "points": [
                {
                    "x": 262,
                    "y": 160
                } as Point,
                {
                    "x": 314,
                    "y": 160
                } as Point,
                {
                    "x": 339,
                    "y": 107
                } as Point,
                {
                    "x": 415,
                    "y": 107
                } as Point,
                {
                    "x": 445,
                    "y": 160
                } as Point,
                {
                    "x": 489,
                    "y": 160
                } as Point,
                {
                    "x": 489,
                    "y": 355
                } as Point,
                {
                    "x": 344,
                    "y": 355
                } as Point,
                {
                    "x": 344,
                    "y": 303
                } as Point,
                {
                    "x": 262,
                    "y": 303
                } as Point
            ]
        } as Room,
        {
            "name": "Sypialnia",
            "color": "128, 128, 128",
            "points": [
                {
                    "x": 489,
                    "y": 355
                } as Point,
                {
                    "x": 489,
                    "y": 501
                } as Point,
                {
                    "x": 367,
                    "y": 501
                } as Point,
                {
                    "x": 367,
                    "y": 473
                } as Point,
                {
                    "x": 344,
                    "y": 473
                } as Point,
                {
                    "x": 344,
                    "y": 355
                } as Point
            ]
        } as Room,
        {
            "name": "Łazienka",
            "color": "128, 128, 128",
            "points": [
                {
                    "x": 344,
                    "y": 473
                } as Point,
                {
                    "x": 240,
                    "y": 473
                } as Point,
                {
                    "x": 240,
                    "y": 355
                } as Point,
                {
                    "x": 344,
                    "y": 355
                } as Point
            ]
        } as Room,
        {
            "name": "Hol",
            "color": "128, 128, 128",
            "points": [
                {
                    "x": 146,
                    "y": 303
                } as Point,
                {
                    "x": 146,
                    "y": 372
                } as Point,
                {
                    "x": 241,
                    "y": 372
                } as Point,
                {
                    "x": 240,
                    "y": 355
                } as Point,
                {
                    "x": 344,
                    "y": 355
                } as Point,
                {
                    "x": 344,
                    "y": 303
                } as Point
            ]
        } as Room
    ];


    public levels: Level[] = [new Level("Poziom null", this.rooms, 0), new Level("Poziom 1", this.rooms, 1)];
    public location: Location = new Location("SDASDASD", "Lokalizacja Eryka", this.levels);


}
