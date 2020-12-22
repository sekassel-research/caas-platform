import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { KeycloakAuthGuard, KeycloakService } from 'keycloak-angular';

@Injectable()
export class AuthGuard extends KeycloakAuthGuard {
  constructor(
    protected readonly router: Router,
    protected readonly keycloakService: KeycloakService
  ) {
    super(router, keycloakService);
  }

  async isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    // The user has to be logged in use protected routes
    if (!this.authenticated) {
      await this.keycloakService.login({
        redirectUri: window.location.origin + state.url,
      });
    }

    const requiredRoles: string[] = route.data.roles || [];
    return requiredRoles.every((role) => this.roles.includes(role));
  }
}
