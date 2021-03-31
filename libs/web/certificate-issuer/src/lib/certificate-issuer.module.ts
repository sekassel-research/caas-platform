import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateComponent } from './certificate.component';
import { CertificateService } from './certificate.service';
import { CertificateIssuerRoutingModule } from './certificate-issuer-routing.module';

@NgModule({
  imports: [CommonModule, CertificateIssuerRoutingModule],
  declarations: [CertificateComponent],
  providers: [CertificateService],
})
export class CertificateIssuerModule {}
