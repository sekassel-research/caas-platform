import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CertificateNewComponent } from './new/certificate-new.component';

import { CertificateComponent } from './certificate.component';
import { CertificateOverviewComponent } from './overview';
import { CertificateEditComponent } from './edit/certificate-edit.component';

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
