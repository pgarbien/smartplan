import {HttpService, Injectable} from '@nestjs/common';
import {map} from "rxjs/operators";

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

    constructor(private httpService: HttpService) {
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

    getUser(token) {
        const url = "https://svr36.supla.org/api/v2.3.0";
        const config = {
            headers: {Authorization: `Bearer ${token}`}
        };

        return this.httpService.get(url + "/users/current", config)
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
