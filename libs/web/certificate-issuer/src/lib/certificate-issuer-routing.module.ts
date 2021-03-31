import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CertificateComponent } from './certificate.component';
import { CertificateOverviewComponent } from './overview';

const routes: Routes = [
  {
    path: '',
    component: CertificateComponent,
    children: [
      { path: 'overview', component: CertificateOverviewComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertificateIssuerRoutingModule {}
