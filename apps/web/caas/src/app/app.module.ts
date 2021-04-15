import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';

import { ApiModule } from '@caas/web/api';
import { AuthModule } from '@caas/web/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { HomeComponent } from './home/home.component';

@NgModule({
  imports: [ApiModule, AuthModule, AppRoutingModule, BrowserModule, HttpClientModule, KeycloakAngularModule],
  declarations: [AppComponent, HomeComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (keycloakService: KeycloakService) => async () =>
        keycloakService.init({
          config: environment.authConf,
          initOptions: {
            onLoad: 'check-sso',
            checkLoginIframe: false,
          },
          enableBearerInterceptor: true,
          bearerPrefix: 'Bearer', // TODO: Can be removed after updating keycloak on the server
        }),
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
