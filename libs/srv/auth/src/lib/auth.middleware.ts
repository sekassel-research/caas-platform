import { Inject, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { NextFunction } from 'express';

import { Config } from '@caas/srv/config';

import { ExtendedRequest } from './auth.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly AUTH_SCHEMA = 'Bearer';

  constructor(@Inject('CONFIG') private config: Config, private jwtService: JwtService) {}

  use(req: ExtendedRequest, res: Response, next: NextFunction): void {
    const algorithms = this.config.auth.algorithms as any[];
    const issuer = this.config.auth.issuer;
    const authHeader: string[] = req.headers.authorization ? req.headers.authorization.split(' ') : [''];
    if (authHeader[0] === this.AUTH_SCHEMA) {
      const token = authHeader[1];
      try {
        const validToken = this.jwtService.verify(token, { algorithms, issuer });
        if (validToken) {
          let roles = validToken.scope || [];
          let resourceRoles = [];
          try {
            roles = validToken.realm_access.roles;
          } catch (err) {
            roles = validToken.scope || [];
          }
          try {
            resourceRoles = validToken.resource_access[this.config.auth.resource].roles;
          } catch (err) {
            resourceRoles = [];
          }

          req.user = {
            id: validToken.sub,
            name: validToken.preferred_username || validToken.name,
            clientId: validToken.clientId,
            roles,
            resourceRoles,
          };
        }
      } catch (err) {
        const message = err.message ? err.message : 'Invalid Token';
        throw new UnauthorizedException(message);
      }
    } else {
      throw new UnauthorizedException(`Unsupported authentication methods: ${authHeader[0]}. Please use 'Bearer' instead.`);
    }

    next();
  }
}
