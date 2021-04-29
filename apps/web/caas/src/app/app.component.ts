import { Component, OnInit } from '@angular/core';

import { from, Observable } from 'rxjs';

import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'caas-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public username = '';
  public authenticated: Observable<boolean>;

  private roles: string[] = [];

  constructor(public keycloakService: KeycloakService) {}

  ngOnInit(): void {
    this.roles = this.keycloakService.getUserRoles(true);
    this.authenticated = from(this.keycloakService.isLoggedIn());
  }

  public hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
}
