import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CertificateComponent } from './certificate.component';
import { CertificateIssuerRoutingModule } from './certificate-issuer-routing.module';
import { CertificateNewComponent } from './new/certificate-new.component';
import { CertificateEditComponent } from './edit/certificate-edit.component';

@NgModule({
  imports: [CommonModule, CertificateIssuerRoutingModule, ReactiveFormsModule],
  declarations: [CertificateComponent, CertificateNewComponent, CertificateEditComponent],
})
export class CertificateIssuerModule {}
