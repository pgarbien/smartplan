import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptionWithRequest, VerifyFunctionWithRequest } from 'passport-oauth2';

import AuthService, { AuthProfile } from './auth.service';

const strategyRequest = {
    authorizationURL: 'https://svr36.supla.org/oauth/v2/auth',
    tokenURL: 'https://svr36.supla.org/oauth/v2/token',
    clientID: "7_1iz810w77xfoko0w4k4c8s88w40gs80w444wcwo404gc8kc8cc",
    clientSecret: "2ypf177cmpk4o8wcw8w0k4kgkks44o4sos8oksw40oo04ckwo8",
    callbackURL: 'http://localhost:4000/auth/supla/callback'
} as StrategyOptionWithRequest;

const callbackFunction = 
    (authService: AuthService) => (async (req, access, refresh, profile, done) => {
        const user = await authService.getUser(req).toPromise()
        
        const authProfile: AuthProfile = {
            id: user.shortUniqueId,
            access_token: refresh.access_token,
            expires_in: refresh.expires_in,
            scope: refresh.scope,
            target_url: refresh.target_url
        }

        return authService
            .handlePassportAuth(authProfile)
            .then(result => done(null, result))
            .catch(error => done(error));
    }) as VerifyFunctionWithRequest;

@Injectable()
export class SuplaStrategy extends PassportStrategy(Strategy, 'supla') {
  constructor(private authService: AuthService) {
    super(strategyRequest, callbackFunction(authService));
  }
}
