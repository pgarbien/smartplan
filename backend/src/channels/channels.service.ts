import {HttpService, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {map} from "rxjs/operators";
import AuthService from "../auth/auth.service";

@Injectable()
export class ChannelsService {
    constructor(private readonly configService: ConfigService,
                private readonly httpService: HttpService,
                private readonly authService: AuthService) { }

    private apiKey: string = this.configService.get<string>('API_KEY');
    private apiUrl = this.configService.get<string>('API_URL') + '/channels';

    private config = {
        headers: {Authorization: `Bearer ${this.apiKey}`}
    };


    getChannels(token: string) {
        console.log("Url: " + this.getUrlForToken(token));
        return this.httpService.get('https://svr32.supla.org/api/v2.3.0/channels', {
            headers: {Authorization: `Bearer ${token}`}
        })
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

    getUrlForToken(token: string): string {
        return this.authService.getLoggedUserByToken(token).target_url + this.apiUrl
    }
}
