import {HttpService, Injectable} from '@nestjs/common';
import {map} from "rxjs/operators";
import AuthService from "../auth/auth.service";
import {ActionType} from "../device/device.supla.model";
import configuration from "../../config/configuration";

@Injectable()
export class ChannelsService {
    constructor(private readonly httpService: HttpService,
                private readonly authService: AuthService) {
    }

    private channelsUrl = configuration().supla.apiVersion + '/channels';
    private iconsUrl = configuration().supla.apiVersion + '/user-icons';

    public getChannels(userId: string, token: string) {
        return this.httpService.get(
            this.getUrlForToken(token) + this.channelsUrl,
            this.getHeaders(token)
        )
            .pipe(map(response => response.data))
            .toPromise();
    }

    public getChannelsWithStates(userId: string, token: string) {
        return this.httpService.get(
            this.getUrlForToken(token) + `${this.channelsUrl}?include=connected&include=state`,
            this.getHeaders(token)
        )
            .pipe(map(response => response.data))
            .toPromise();
    }

    public getChannelById(userId: string, channelId: number, token: string) {
        return this.httpService.get(
            this.getUrlForToken(token) + `${this.channelsUrl}/${channelId}?include=connected&include=state`,
            this.getHeaders(token)
        )
            .pipe(map(response => response.data))
            .toPromise();
    }

    public callAction(userId: string, channelId: number, actionType: ActionType, token: string) {
        return this.httpService.patch(
            this.getUrlForToken(token) + `${this.channelsUrl}/${channelId}`,
            { action: ActionType[actionType] },
            this.getHeaders(token)
        )
            .pipe(map(response => response.data))
            .toPromise();
    }

    public getIconById(userId: string, iconId: number, token: string) {
        return this.httpService.get(
            this.getUrlForToken(token) + `${this.iconsUrl}?include=images&ids=${iconId}`,
            this.getHeaders(token)
        )
            .pipe(map(response => response.data))
            .toPromise();
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
