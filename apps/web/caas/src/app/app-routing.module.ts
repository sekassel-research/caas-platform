import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AuthGuard } from '@caas/web/auth';

import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      public: true,
    },
  },
  {
    path: 'artifacts',
    loadChildren: () => import('@caas/web/artifact-runner').then((m) => m.ArtifactRunnerModule),
    canActivate: [AuthGuard],
    data: {
      roles: ['admin'],
    },
  },
  {
    path: 'tests',
    loadChildren: () => import('@caas/web/confirmance-test').then((m) => m.ConfirmanceTestModule),
    canActivate: [AuthGuard],
    data: {
      roles: ['admin'],
    },
  },
  {
    path: 'certificates',
    loadChildren: () => import('@caas/web/certificate-issuer').then((m) => m.CertificateIssuerModule),
    canActivate: [AuthGuard],
    data: {
      roles: ['admin'],
    },
  },
  {
    path: 'environments',
    loadChildren: () => import('@caas/web/test-environment').then((m) => m.TestEnvironmentModule),
    canActivate: [AuthGuard],
    data: {
      roles: ['admin'],
    },
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
