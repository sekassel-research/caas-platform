import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CertificateComponent } from './certificate.component';
import { CertificateOverviewComponent } from './overview';
import { CertificateEditComponent } from './edit';
import { CertificateNewComponent } from './new';

const routes: Routes = [
  {
    path: '',
    component: CertificateComponent,
    children: [
      { path: 'overview', component: CertificateOverviewComponent },
      { path: 'new', component: CertificateNewComponent },
      { path: ':id', component: CertificateEditComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CertificateIssuerRoutingModule {}
