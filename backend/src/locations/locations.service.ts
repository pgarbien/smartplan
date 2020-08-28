import {HttpService, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {map} from "rxjs/operators";
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

    getLocations() {
        return this.httpService.get(this.apiUrl, this.config)
            .pipe(
                map(response => response.data)
            );
    }

    get() {
        return this.locationsRepository.find();
    }

    create() {
        console.log("aaa");
        this.locationsRepository.save({name: "aaa", levels: []} as Location)
    }

    getLocationById(locationId: number) {
        return this.httpService.get(this.apiUrl + `/${locationId}`)
            .pipe(
                map(response => response.data)
            );
    }

    async persist(location: Location): Promise<Location> {
        return await this.locationsRepository.save(location);
    }


    public rooms: Room[] =  [
        {
            "name":"Metr kwadratowy",
            "color":"128, 128, 128",
            "points":[
                {
                    "x":590,
                    "y":590
                } as Point,
                {
                    "x":540,
                    "y":590
                } as Point,
                {
                    "x":540,
                    "y":540
                } as Point,
                {
                    "x":590,
                    "y":540
                } as Point
            ]
        } as Room,
        {
            "name":"Sypialnia",
            "color":"128, 128, 128",
            "points":[
                {
                    "x":146,
                    "y":303
                } as Point,
                {
                    "x":146,
                    "y":160
                } as Point,
                {
                    "x":262,
                    "y":160
                } as Point,
                {
                    "x":262,
                    "y":303
                } as Point
            ]
        } as Room,
        {
            "name":"Salon",
            "color":"128, 128, 128",
            "points":[
                {
                    "x":262,
                    "y":160
                } as Point,
                {
                    "x":314,
                    "y":160
                } as Point,
                {
                    "x":339,
                    "y":107
                } as Point,
                {
                    "x":415,
                    "y":107
                } as Point,
                {
                    "x":445,
                    "y":160
                } as Point,
                {
                    "x":489,
                    "y":160
                } as Point,
                {
                    "x":489,
                    "y":355
                } as Point,
                {
                    "x":344,
                    "y":355
                } as Point,
                {
                    "x":344,
                    "y":303
                } as Point,
                {
                    "x":262,
                    "y":303
                } as Point
            ]
        } as Room,
        {
            "name":"Sypialnia",
            "color":"128, 128, 128",
            "points":[
                {
                    "x":489,
                    "y":355
                } as Point,
                {
                    "x":489,
                    "y":501
                } as Point,
                {
                    "x":367,
                    "y":501
                } as Point,
                {
                    "x":367,
                    "y":473
                } as Point,
                {
                    "x":344,
                    "y":473
                } as Point,
                {
                    "x":344,
                    "y":355
                } as Point
            ]
        } as Room,
        {
            "name":"Łazienka",
            "color":"128, 128, 128",
            "points":[
                {
                    "x":344,
                    "y":473
                } as Point,
                {
                    "x":240,
                    "y":473
                } as Point,
                {
                    "x":240,
                    "y":355
                } as Point,
                {
                    "x":344,
                    "y":355
                } as Point
            ]
        } as Room,
        {
            "name":"Hol",
            "color":"128, 128, 128",
            "points":[
                {
                    "x":146,
                    "y":303
                } as Point,
                {
                    "x":146,
                    "y":372
                } as Point,
                {
                    "x":241,
                    "y":372
                } as Point,
                {
                    "x":240,
                    "y":355
                } as Point,
                {
                    "x":344,
                    "y":355
                } as Point,
                {
                    "x":344,
                    "y":303
                } as Point
            ]
        } as Room
    ];


    public levels: Level[] = [new Level( "Poziom null" , this.rooms, 0), new Level( "Poziom 1", this.rooms, 1)];
    public location: Location = new Location( "Lokalizacja Eryka", this.levels);


}
