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

    private channelsUrl = this.configService.get<string>('API_URL') + '/channels';
    private iconsUrl = this.configService.get<string>('API_URL') + '/user-icons';

    getChannels(userId: string) {
        const token: string = this.authService.getTokenByUserId(userId);

        return this.httpService.get(this.getUrlForToken(token) + this.channelsUrl, this.getHeaders(token)).pipe(
            map(response => response.data)
        ).toPromise();
    }

    getChannelsWithStates(userId: string) {
        const token: string = this.authService.getTokenByUserId(userId);

        return this.httpService.get(this.getUrlForToken(token) + `${this.channelsUrl}?include=connected&include=state`, this.getHeaders(token)).pipe(
            map(response => response.data)
        ).toPromise();
    }

    getChannelById(userId: string, channelId: number) {
        const token: string = this.authService.getTokenByUserId(userId);

        return this.httpService.get(this.getUrlForToken(token) + `${this.channelsUrl}/${channelId}?include=connected&include=state`,
            this.getHeaders(token)).pipe(
                map(response => response.data)
            ).toPromise();
    }

    callAction(userId: string, channelId: number, actionType: ActionType) {
        const token: string = this.authService.getTokenByUserId(userId);
        return this.httpService.patch(this.getUrlForToken(token) + `${this.channelsUrl}/${channelId}`, {action: ActionType[actionType]},
            this.getHeaders(token)).pipe(
                map(response => response.data)
            ).toPromise();
    }

    getIconById(userId: string, iconId: number) {
        const token: string = this.authService.getTokenByUserId(userId);
        return this.httpService.get(this.getUrlForToken(token) + `${this.iconsUrl}?include=images&ids=${iconId}`, this.getHeaders(token)).pipe(
            map(response => response.data)
        ).toPromise();
    }

    private getUrlForToken(token: string): string {
        return this.authService.getLoggedUserByToken(token).target_url;
    }

    private getHeaders(token: string) {
        return {
            headers: {Authorization: `Bearer ${token}`}
        }
    }
}
