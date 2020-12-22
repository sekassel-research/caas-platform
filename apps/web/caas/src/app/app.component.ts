import { Component, OnInit } from '@angular/core';

import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'caas-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public username = '';
  public authenticated = false;

  private roles: string[] = [];

  constructor(public keycloakService: KeycloakService) {}

  ngOnInit(): void {
    this.roles = this.keycloakService.getUserRoles(true);
    try {
      this.username = this.keycloakService.getUsername();
      this.authenticated = true;
    } catch (err) {
      // User is not logged in
      this.authenticated = false;
    }
  }

  public hasRole(role: string): boolean {
    return this.roles.includes(role);
  }
}
