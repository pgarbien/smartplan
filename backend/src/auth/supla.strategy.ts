import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, StrategyOptionWithRequest, VerifyFunctionWithRequest } from 'passport-oauth2';

import AuthService from './auth.service';

export type AuthProvider = 'supla';

export interface AuthProfile {
    name: string
}

@Injectable()
export class SuplaStrategy extends PassportStrategy(Strategy, 'supla') {
  // Facebook strategy should be pretty much the same
  constructor(auth: AuthService) {
    super(
      <StrategyOptionWithRequest>{
        authorizationURL: 'https://svr36.supla.org/oauth/v2/auth',
        tokenURL: 'https://svr36.supla.org/oauth/v2/token',
        clientID: "7_1iz810w77xfoko0w4k4c8s88w40gs80w444wcwo404gc8kc8cc",
        clientSecret: "2ypf177cmpk4o8wcw8w0k4kgkks44o4sos8oksw40oo04ckwo8",
        callbackURL: 'http://localhost:4000/auth/supla/callback'
      },
      <VerifyFunctionWithRequest>(async (
        req,     // express request object
        access,  // access token from Google
        refresh, // refresh token from Google
        profile, // user profile, parsed by passport
        done
      ) => {
        // transform the profile to your expected shape
        const myProfile: AuthProfile = {
            name: "Eryk"
        }

        return auth
          .handlePassportAuth(myProfile)
          .then(result => done(null, result))
          .catch(error => done(error));
      })
    );
  }
}