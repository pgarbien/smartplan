import {
    Controller,
    Get,
    Headers,
    Next,
    Param,
    Req,
    Res,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import AuthService, {AuthProvider} from './auth.service'
import {NextFunction, Request, Response} from 'express';
import * as passport from 'passport';
import {ConfigService} from "@nestjs/config";
import {ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse} from "@nestjs/swagger";
import {AuthUrlResponse, RefreshTokenResponse} from "./auth.model";
import {AuthGuard} from "../auth.guard";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
    }

    private callbackUrl = this.configService.get('SUPLA_CALLBACK_URL');
    private suplaAuthUrl = this.configService.get('SUPLA_AUTH_URL');
    private websiteUrl = this.configService.get('WEBSITE_URL');
    private clientId = this.configService.get('SUPLA_CLIENT_ID');
    private scopes = ['channels_r', 'account_r', 'channels_ea', 'offline_access'];


    @Get('/link')
    @ApiOkResponse({type: AuthUrlResponse})
    public getAuthUrl(): any {
        return new AuthUrlResponse(
            this.suplaAuthUrl +
                `?client_id=${this.clientId}` +
                `&scope=${this.scopes.join('%20')}` +
                `&state=example-state` +
                `&response_type=code` +
                `&redirect_uri=${this.callbackUrl}`
        );
    }

    @Get('/refresh')
    @UseGuards(AuthGuard)
    @ApiOkResponse()
    @ApiUnauthorizedResponse()
    public async refreshToken(@Req() req: any): Promise<RefreshTokenResponse>{
        const token = await this.authService.refreshOAuthToken(req.headers['authorization'].replace("Bearer ", ""));
        return new  RefreshTokenResponse(token);
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

            return res.redirect(`${this.websiteUrl}/auth?token=${user.access_token}&timeout=${user.expires_in}`)
        })(req, res, next);
    }

    // @Get(':token')
    // async checkIfLoggedIn(@Param('token') token: string) {
    //     return this.authService.checkIfLoggedIn(token)
    // }


}
