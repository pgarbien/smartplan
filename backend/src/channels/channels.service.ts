import {HttpService, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {map} from "rxjs/operators";
import AuthService from "../auth/auth.service";

@Injectable()
export class ChannelsService {
    constructor(private readonly configService: ConfigService,
                private readonly httpService: HttpService,
                private readonly authService: AuthService) {
    }

    private apiKey: string = this.configService.get<string>('API_KEY');
    private apiUrl = this.configService.get<string>('API_URL') + '/channels';

    private config = {
        headers: {Authorization: `Bearer ${this.apiKey}`}
    };


    getChannels(userId: string) {
        const token: string = this.authService.getTokenByUserId(userId);

        return this.httpService.get(this.getUrlForToken(token), {
            headers: {Authorization: `Bearer ${token}`}
        }).pipe(
            map(response => response.data)
        ).toPromise();
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

    private getUrlForToken(token: string): string {
        return this.authService.getLoggedUserByToken(token).target_url + this.apiUrl
    }
}
