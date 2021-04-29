import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtifactService } from './artifact.service';
import { CertificateService } from './certificate.service';
import { TestEnvironmentService } from './test-environment.service';
import { ConfirmanceTestService } from './confirmance-test.service';

@NgModule({
  imports: [CommonModule],
  providers: [ArtifactService, CertificateService, TestEnvironmentService, ConfirmanceTestService],
})
export class ApiModule {}
