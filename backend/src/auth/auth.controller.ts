import {Controller, Get, Next, Param, Req, Res, UnauthorizedException} from '@nestjs/common';
import AuthService, {AuthProvider} from './auth.service'
import {NextFunction, Request, Response} from 'express';
import * as passport from 'passport';
import {ConfigService} from "@nestjs/config";

@Controller('auth')
export class AuthController {
    constructor(private readonly auth: AuthService, private readonly configService: ConfigService) {
    }

    private callbackUrl = this.configService.get('SUPLA_CALLBACK_URL');
    private suplaAuthUrl = this.configService.get('SUPLA_AUTH_URL');
    private clientId = this.configService.get('SUPLA_CLIENT_ID');
    private scopes = ['channels_r', 'account_r'];

    @Get('/link')
    getAuthUrl(): any {
        console.log("Got request");
        return {authUrl: `${this.suplaAuthUrl}?client_id=${this.clientId}&scope=${this.scopes.join('%20')}&state=example-state&response_type=code&redirect_uri=${this.callbackUrl}`};
        // https://svr36.supla.org/oauth/v2/auth?client_id=7_1iz810w77xfoko0w4k4c8s88w40gs80w444wcwo404gc8kc8cc&scope=account_r%20channels_r&state=example-state&response_type=code&redirect_uri=http%3A%2F%2F192.168.0.115%3A4000%2Fauth%2Fsupla%2Fcallback
    }

    @Get(':provider(supla)')
    async handleOauthRequest(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction,
        @Param('provider') provider: AuthProvider
    ) {
        //TODO add scopes from supla docs
        const params = {
            session: false,
            scope: this.scopes,
            callbackURL: this.callbackUrl,
        };
        console.log(params);
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

            return res.redirect("http://localhost:3000/auth?token=" + user.access_token)
        })(req, res, next);
    }

    @Get(':token')
    async checkIfLoggedIn(@Param('token') token: string) {
        return this.auth.checkIfLoggedIn(token)
    }


}
