import {HttpService, Injectable} from '@nestjs/common';
import {map} from "rxjs/operators";
import {ConfigService} from "@nestjs/config";

export type AuthProvider = 'supla';

export interface AuthProfile {
    id: string,
    access_token: string,
    expires_in: number,
    scope: string,
    target_url: string
}

@Injectable()
export default class AuthService {
    private tokenToUserMap = {};
    private userIdToTokenMap = {};

    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    }

    async handlePassportAuth(profile: AuthProfile) {
        this.tokenToUserMap[profile.access_token] = profile;
        this.userIdToTokenMap[profile.id] = profile.access_token;
        setTimeout(() => {
            this.tokenToUserMap[profile.access_token] = null;
            this.userIdToTokenMap[profile.id] = null;
        }, profile.expires_in * 1000);

        return profile;
    }

    getUser(token: string, url: string) {
        const apiUrl = this.configService.get<string>('API_URL')

        const config = {
            headers: {Authorization: `Bearer ${token}`}
        };

        return this.httpService.get(url + apiUrl + "/users/current", config)
            .pipe(
                map(response => response.data)
            );
    }

    getLoggedUserByToken(token: string): AuthProfile {
        return this.tokenToUserMap[token];
    }

    checkIfLoggedIn(token: string): boolean {
        return this.tokenToUserMap[token] != null
    }

    getTokenByUserId(userId: string): string {
        return this.userIdToTokenMap[userId];
    }
}
