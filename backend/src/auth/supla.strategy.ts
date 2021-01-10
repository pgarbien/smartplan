import {Injectable} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {Strategy, StrategyOptionWithRequest, VerifyFunctionWithRequest} from 'passport-oauth2';
import AuthService from './auth.service';
import {AuthProfile} from "./auth.model";
import configuration from "../../config/configuration";

const callbackFunction =
    (authService: AuthService) => (async (req, access, refresh, profile, done) => {
        const user = await authService.getUser(req, refresh.target_url).toPromise();

        const authProfile: AuthProfile = {
            id: user.shortUniqueId,
            access_token: refresh.access_token,
            expires_in: refresh.expires_in,
            scope: refresh.scope,
            target_url: refresh.target_url,
            refresh_token: access
        }

        return await authService
            .handlePassportAuth(authProfile)
            .then(result => done(null, result))
            .catch(error => done(error));
    }) as VerifyFunctionWithRequest;

@Injectable()
export class SuplaStrategy extends PassportStrategy(Strategy, 'supla') {
    constructor(private readonly authService: AuthService) {
        super({
            authorizationURL: configuration().supla.authUrl,
            tokenURL: configuration().supla.tokenUrl,
            clientID: configuration().supla.clientId,
            clientSecret: configuration().supla.clientSecret,
            callbackURL: configuration().supla.callbackUrl
        } as StrategyOptionWithRequest,
            callbackFunction(authService));
    }
}
