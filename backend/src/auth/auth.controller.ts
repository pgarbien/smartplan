import {Controller, Get, Next, Param, Req, Res, UnauthorizedException} from '@nestjs/common';
import AuthService, {AuthProvider} from './auth.service'
import {NextFunction, Request, Response} from 'express';
import * as passport from 'passport';
import {ConfigService} from "@nestjs/config";
import {ApiOkResponse} from "@nestjs/swagger";
import {AuthUrlResponse} from "./auth.model";

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService, private readonly configService: ConfigService) {
    }

    private callbackUrl = this.configService.get('SUPLA_CALLBACK_URL');
    private suplaAuthUrl = this.configService.get('SUPLA_AUTH_URL');
    private websiteUrl = this.configService.get('WEBSITE_URL');
    private clientId = this.configService.get('SUPLA_CLIENT_ID');
    private scopes = ['channels_r', 'account_r', 'channels_ea'];

    @Get('/link')
    @ApiOkResponse({type: AuthUrlResponse})
    getAuthUrl(): any {
        return new AuthUrlResponse(
            this.suplaAuthUrl +
                `?client_id=${this.clientId}` +
                `&scope=${this.scopes.join('%20')}` +
                `&state=example-state` +
                `&response_type=code` +
                `&redirect_uri=${this.callbackUrl}`
        );
    }

    @Get(':provider(supla)')
    async handleOauthRequest(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
        @Param('provider') provider: AuthProvider
    ) {
        const params = {
            session: false,
            scope: this.scopes,
            callbackURL: this.callbackUrl,
        };

        passport.authenticate(provider, params)(req, res, next);
    }

    @Get(':provider(supla)/callback')
    async handleOauthCallback(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
        @Param('provider') provider: AuthProvider
    ) {
        const params = {
            session: false,
            callbackURL: this.callbackUrl
        };

        passport.authenticate(provider, params, (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) return next(new UnauthorizedException());

            return res.redirect(`${this.websiteUrl}/auth?token=${user.access_token}`)
        })(req, res, next);
    }

    @Get(':token')
    async checkIfLoggedIn(@Param('token') token: string) {
        return this.auth.checkIfLoggedIn(token)
    }


}
