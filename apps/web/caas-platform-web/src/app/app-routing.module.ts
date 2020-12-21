import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { AuthGuard } from '@caas-platform-web/web/auth';

import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      public: true
    }
  },
  {
    path: 'artifacts',
    loadChildren: () => import('@caas-platform-web/web/artifact-runner').then((m) => m.ArtifactRunnerModule),
    canActivate: [AuthGuard],
    data: {
      roles: ['admin']
    }
  },
  {
    path: 'tests',
    loadChildren: () => import('@caas-platform-web/web/confirmance-test').then((m) => m.ConfirmanceTestModule),
    canActivate: [AuthGuard],
    data: {
      roles: ['admin']
    }
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
