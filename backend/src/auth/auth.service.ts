import {HttpService, Injectable} from '@nestjs/common';
import {map} from "rxjs/operators";
import {ConfigService} from "@nestjs/config";
import {AuthProfile} from "./auth.model";

export type AuthProvider = 'supla';



@Injectable()
export default class AuthService {
    private tokenToUserMap = {};

    constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    }

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
            "client_id": this.configService.get<string>('SUPLA_CLIENT_ID'),
            "client_secret": this.configService.get<string>('SUPLA_CLIENT_SECRET'),
            "refresh_token": refreshToken
        }

        const refreshedProfile: AuthProfile = await this.httpService.post(
            this.configService.get<string>('SUPLA_TOKEN_URL'),
            request
        )
            .pipe(map(response => response.data))
            .toPromise();

        this.tokenToUserMap[refreshedProfile.access_token] = refreshedProfile;

        return refreshedProfile.access_token;
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

    static getTokenFromRequest(req: any) {
        return req.headers['authorization'];
    }
}
