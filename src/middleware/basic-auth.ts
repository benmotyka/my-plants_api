import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { BasicStrategy } from 'passport-http';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BasicAuth implements NestMiddleware {
  constructor(private configService: ConfigService) {
    passport.use(
      new BasicStrategy(function (username, password, done) {
        // TEMP
        if (configService.get('ENABLE_BASICAUTH') === 'yes') {
          return done(null, true);
        }
        if (
          configService.get('BASIC_AUTH_USERNAME') === username &&
          configService.get('BASIC_AUTH_PASSWORD') === password
        ) {
          return done(null, true);
        }
        return done(new UnauthorizedException());
      }),
    );
  }

  use(req: Request, res: Response, next: NextFunction) {
    const authenticate = () =>
      passport.authenticate('basic', { session: false })(req, res, next);

    return authenticate();
  }
}
