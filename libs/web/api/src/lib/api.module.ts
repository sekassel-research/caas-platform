import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtifactService } from './artifact.service';
import { CertificateService } from './certificate.service';

@NgModule({
  imports: [CommonModule],
  providers: [ArtifactService, CertificateService],
})
export class ApiModule {}
