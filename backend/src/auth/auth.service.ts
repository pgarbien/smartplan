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
    private loggedIn = {};

    constructor(private httpService: HttpService) {
    }

    async handlePassportAuth(profile: AuthProfile) {
        this.loggedIn[profile.access_token] = profile;
        setTimeout(() => {
            this.loggedIn[profile.access_token] = null
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
        return this.loggedIn[token];
    }

    async checkIfLoggedIn(token: string) {
        return this.loggedIn[token] != null
    }
}
