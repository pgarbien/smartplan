import {HttpService, Injectable} from '@nestjs/common';
import {map} from "rxjs/operators";
import {AuthProfile} from "./auth.model";
import configuration from "../../config/configuration";

export type AuthProvider = 'supla';

@Injectable()
export default class AuthService {
    private tokenToUserMap = {};

    constructor(private readonly httpService: HttpService) {
    }


    private clientID = configuration().supla.clientId;
    private clientSecret = configuration().supla.clientSecret;
    private apiUrl = configuration().supla.apiVersion;
    private tokenUrl = configuration().supla.tokenUrl;

    async handlePassportAuth(profile: AuthProfile) {
        this.tokenToUserMap[profile.access_token] = profile;

        setTimeout(() => {
            this.tokenToUserMap[profile.access_token] = null;
        }, profile.expires_in * 1000);

        return profile;
    }

    async refreshOAuthToken(accessToken: string): Promise<string> {
        const refreshToken = this.tokenToUserMap[accessToken].refresh_token;

        const request = {
            "grant_type": "refresh_token",
            "client_id": this.clientID,
            "client_secret": this.clientSecret,
            "refresh_token": refreshToken
        }

        const refreshedProfile: AuthProfile = await this.httpService.post(this.tokenUrl,request)
            .pipe(map(response => response.data))
            .toPromise();

        this.tokenToUserMap[refreshedProfile.access_token] = refreshedProfile;

        return refreshedProfile.access_token;
    }

    getUser(token: string, url: string) {
        const config = {
            headers: {Authorization: `Bearer ${token}`}
        };

        return this.httpService.get(url + this.apiUrl + "/users/current", config)
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

    static getTokenFromRequest(req: any) {
        return req.headers['authorization'];
    }
}
