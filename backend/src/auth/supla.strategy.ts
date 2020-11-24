import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy, StrategyOptionWithRequest, VerifyFunctionWithRequest} from 'passport-oauth2';

import AuthService, {AuthProfile} from './auth.service';
import {ConfigService} from "@nestjs/config";

const callbackFunction =
    (authService: AuthService) => (async (req, access, refresh, profile, done) => {
        const user = await authService.getUser(req, refresh.target_url).toPromise();

        const authProfile: AuthProfile = {
            id: user.shortUniqueId,
            access_token: refresh.access_token,
            expires_in: refresh.expires_in,
            scope: refresh.scope,
            target_url: refresh.target_url
        }

        return await authService
            .handlePassportAuth(authProfile)
            .then(result => done(null, result))
            .catch(error => done(error));
    }) as VerifyFunctionWithRequest;

@Injectable()
export class SuplaStrategy extends PassportStrategy(Strategy, 'supla') {
    constructor(private readonly authService: AuthService, private readonly configService: ConfigService) {
        super({
            authorizationURL: configService.get('SUPLA_AUTH_URL'),
            tokenURL: configService.get('SUPLA_TOKEN_URL'),
            clientID: configService.get('SUPLA_CLIENT_ID'),
            clientSecret: configService.get('SUPLA_CLIENT_SECRET'),
            callbackURL: configService.get('SUPLA_CALLBACK_URL')
        } as StrategyOptionWithRequest,
            callbackFunction(authService));
    }
}
