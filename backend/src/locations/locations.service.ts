import {HttpService, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {map} from "rxjs/operators";
import {Level} from "../model/level.model";
import {Room} from "../model/room.model";
import {Location} from "../model/location.model";

@Injectable()
export class LocationsService {
    constructor(private configService: ConfigService, private httpService: HttpService) {

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


    getLocationById(locationId: number) {
        return this.httpService.get(this.apiUrl + `/${locationId}`)
            .pipe(
                map(response => response.data)
            );
    }

    public rooms: Room[] =  [
        {
            "id": 0,
            "name":"Metr kwadratowy",
            "color":"128, 128, 128",
            "points":[
                {
                    "id": 0,
                    "x":590,
                    "y":590
                },
                {
                    "id": 1,
                    "x":540,
                    "y":590
                },
                {
                    "id": 2,
                    "x":540,
                    "y":540
                },
                {
                    "id": 0,
                    "x":590,
                    "y":540
                }
            ]
        },
        {
            "id": 0,
            "name":"Sypialnia",
            "color":"128, 128, 128",
            "points":[
                {
                    "id": 0,
                    "x":146,
                    "y":303
                },
                {
                    "id": 0,
                    "x":146,
                    "y":160
                },
                {
                    "id": 0,
                    "x":262,
                    "y":160
                },
                {
                    "id": 0,
                    "x":262,
                    "y":303
                }
            ]
        },
        {
            "id": 0,
            "name":"Salon",
            "color":"128, 128, 128",
            "points":[
                {
                    "id": 0,
                    "x":262,
                    "y":160
                },
                {
                    "id": 0,
                    "x":314,
                    "y":160
                },
                {
                    "id": 0,
                    "x":339,
                    "y":107
                },
                {
                    "id": 0,
                    "x":415,
                    "y":107
                },
                {
                    "id": 0,
                    "x":445,
                    "y":160
                },
                {
                    "id": 0,
                    "x":489,
                    "y":160
                },
                {
                    "id": 0,
                    "x":489,
                    "y":355
                },
                {
                    "id": 0,
                    "x":344,
                    "y":355
                },
                {
                    "id": 0,
                    "x":344,
                    "y":303
                },
                {
                    "id": 0,
                    "x":262,
                    "y":303
                }
            ]
        },
        {
            "id": 0,
            "name":"Sypialnia",
            "color":"128, 128, 128",
            "points":[
                {
                    "id": 0,
                    "x":489,
                    "y":355
                },
                {
                    "id": 0,
                    "x":489,
                    "y":501
                },
                {
                    "id": 0,
                    "x":367,
                    "y":501
                },
                {
                    "id": 0,
                    "x":367,
                    "y":473
                },
                {
                    "id": 0,
                    "x":344,
                    "y":473
                },
                {
                    "id": 0,
                    "x":344,
                    "y":355
                }
            ]
        },
        {
            "id": 0,
            "name":"Łazienka",
            "color":"128, 128, 128",
            "points":[
                {
                    "id": 0,
                    "x":344,
                    "y":473
                },
                {
                    "id": 0,
                    "x":240,
                    "y":473
                },
                {
                    "id": 0,
                    "x":240,
                    "y":355
                },
                {
                    "id": 0,
                    "x":344,
                    "y":355
                }
            ]
        },
        {
            "id": 0,
            "name":"Hol",
            "color":"128, 128, 128",
            "points":[
                {
                    "id": 0,
                    "x":146,
                    "y":303
                },
                {
                    "id": 0,
                    "x":146,
                    "y":372
                },
                {
                    "id": 0,
                    "x":241,
                    "y":372
                },
                {
                    "id": 0,
                    "x":240,
                    "y":355
                },
                {
                    "id": 0,
                    "x":344,
                    "y":355
                },
                {
                    "id": 0,
                    "x":344,
                    "y":303
                }
            ]
        }
    ];

    public levels: Level[] = [new Level(0, "Poziom 0", this.rooms, 0), new Level(1, "Poziom 1", this.rooms, 1)];
    public location: Location = new Location(0, "Lokalizacja Eryka", this.levels);
}
