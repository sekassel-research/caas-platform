import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateComponent } from './certificate.component';
import { CertificateService } from './certificate.service';
import { CertificateIssuerRoutingModule } from './certificate-issuer-routing.module';
import { CertificateNewComponent } from './certificate-new/certificate-new.component';

@NgModule({
  imports: [CommonModule, CertificateIssuerRoutingModule],
  declarations: [CertificateComponent, CertificateNewComponent],
  providers: [CertificateService],
})
export class CertificateIssuerModule {}
