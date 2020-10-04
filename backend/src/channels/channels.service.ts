import {HttpService, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {map} from "rxjs/operators";
import AuthService from "../auth/auth.service";
import {ActionType} from "../device/device.model";

@Injectable()
export class ChannelsService {
    constructor(private readonly configService: ConfigService,
                private readonly httpService: HttpService,
                private readonly authService: AuthService) {
    }

    private apiKey: string = this.configService.get<string>('API_KEY');
    private apiUrl = this.configService.get<string>('API_URL') + '/channels';


    getChannels(userId: string) {
        const token: string = this.authService.getTokenByUserId(userId);

        return this.httpService.get(this.getUrlForToken(token), this.getHeaders(token)).pipe(
            map(response => response.data)
        ).toPromise();
    }

    getChannelById(userId: string, channelId: number) {
        const token: string = this.authService.getTokenByUserId(userId);

        return this.httpService.get(this.getUrlForToken(token) + `/${channelId}?include=connected&include=state`,
            this.getHeaders(token)).pipe(
                map(response => response.data)
            ).toPromise();
    }

    callAction(userId: string, channelId: number, actionType: ActionType) {
        const token: string = this.authService.getTokenByUserId(userId);
        return this.httpService.patch(this.getUrlForToken(token) + `/${channelId}`, {action: ActionType[actionType]},
            this.getHeaders(token)).pipe(
                map(response => response.data)
            ).toPromise();
    }

    private getUrlForToken(token: string): string {
        return this.authService.getLoggedUserByToken(token).target_url + this.apiUrl
    }

    private getHeaders(token: string) {
        return {
            headers: {Authorization: `Bearer ${token}`}
        }
    }
}
