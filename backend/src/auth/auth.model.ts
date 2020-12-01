import {ApiProperty} from "@nestjs/swagger";

export class AuthUrlResponse {

    @ApiProperty()
    authUrl: string

    constructor(authUrl: string) {
        this.authUrl = authUrl;
    }
}