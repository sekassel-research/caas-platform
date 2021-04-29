import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TestEnvironmentRoutingModule } from './test-environment-routing.module';
import { TestEnvironmentComponent } from './test-environment.component';
import { TestEnvironmentService } from './test-environment.service';
import { TestEnvironmentOverviewComponent } from './overview';
import { TestEnvironmentNewComponent } from './new';

import { ArtifactService } from '@caas/web/api';
import { CertificateService } from '@caas/web/api';

@NgModule({
  imports: [
    TestEnvironmentRoutingModule, 
    CommonModule, 
    ReactiveFormsModule
  ],
  declarations: [
    TestEnvironmentComponent, 
    TestEnvironmentOverviewComponent,
    TestEnvironmentNewComponent,
  ],
  providers: [
    TestEnvironmentService,
    ArtifactService,
    CertificateService,
  ],
})
export class TestEnvironmentModule {}