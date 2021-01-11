import {ApiProperty} from "@nestjs/swagger";

export class AuthUrlResponse {

    @ApiProperty()
    authUrl: string;

    constructor(authUrl: string) {
        this.authUrl = authUrl;
    }
}

export class RefreshTokenResponse {
    @ApiProperty()
    token: string;


    constructor(token: string) {
        this.token = token;
    }
}

export interface AuthProfile {
    id: string,
    access_token: string,
    expires_in: number,
    scope: string,
    target_url: string,
    refresh_token: string
}