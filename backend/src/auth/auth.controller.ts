import {Controller, Req, Res, Next, Param, Get, UnauthorizedException} from '@nestjs/common';
import AuthService from './auth.service'
import {AuthProvider} from './auth.service'
import { NextFunction, Request, Response } from 'express';
import * as passport from 'passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) { }

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
      scope: ['account_r', 'offline_access'],
      callbackURL: `http://localhost:4000/auth/${provider}/callback`,
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
      callbackURL: `http://localhost:4000/auth/${provider}/callback`
    };
    
    // We use callback here, but you can let passport do the redirect
    // http://www.passportjs.org/docs/downloads/html/#custom-callback
    passport.authenticate(provider, params, (err, user) => {
      if (err) return next(err);
      if (!user) return next(new UnauthorizedException());

      // I generate the JWT token myself and redirect the user,
      // but you can make it more smart.
      return res.redirect("http://localhost:3000?token=" + user.access_token)
    //   this.generateTokenAndRedirect(req, res, user);
    })(req, res, next);
  }

  @Get(':token')
  async checkIfLoggedIn(@Param('token') token: string) {
      return this.auth.checkIfLoggedIn(token)
  }
}