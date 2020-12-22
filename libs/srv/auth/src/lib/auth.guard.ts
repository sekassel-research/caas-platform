import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ExtendedRequest, User } from './auth.interface';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const handler = ctx.getHandler();
    const roles = this.reflector.get<string[]>('roles', handler);
    if (!roles) {
      return true;
    }
    const request: ExtendedRequest = ctx.switchToHttp().getRequest();
    const user: User = request.user;
    const hasRoles = () => {
      const r = !!user.roles.find((role) => !!roles.find((item) => item === role));
      const rr = !!user.resourceRoles.find((role) => !!roles.find((item) => item === role));
      return r || rr;
    };
    if (user && user.roles && hasRoles()) {
      return true;
    } else {
      throw new UnauthorizedException('Missing roles');
    }
  }
}
