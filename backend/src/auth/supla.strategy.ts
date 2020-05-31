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
        authorizationURL: 'https://svr32.supla.org/oauth/v2/auth',
        tokenURL: 'https://svr36.supla.org/oauth/v2/token',
        clientID: "6_621nq9ipln8c4s4cs04scwoko4k80c448kw4woss48kckg0sso",
        clientSecret: "1toxlbw5j4g0wwkso0g8cscc88k408k88ccggwogoo44wso84s",
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
