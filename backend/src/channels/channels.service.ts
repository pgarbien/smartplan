import {HttpService, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {map} from "rxjs/operators";

@Injectable()
export class ChannelsService {
    constructor(private configService: ConfigService, private httpService: HttpService) { }

    private apiKey: string = this.configService.get<string>('API_KEY');
    private apiUrl = this.configService.get<string>('API_URL') + '/channels';

    private config = {
        headers: {Authorization: `Bearer ${this.apiKey}`}
    };


    getChannels() { 
        return this.httpService.get(this.apiUrl, this.config)
            .pipe(
                map(response => response.data)
            );
    }

    getChannelById(channelId: number) {
        return this.httpService.get(this.apiUrl + `/${channelId}?include=connected&include=state`, this.config)
            .pipe(
                map(response => response.data)
            );
    }

    toggleLight(channelId: number) {
        return this.httpService.patch(this.apiUrl + `/${channelId}`, {action: "TOGGLE"}, this.config)
            .pipe(
                map(response => response.data)
            );
    }
}
