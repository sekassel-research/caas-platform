import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TestEnvironmentRoutingModule } from './test-environment-routing.module';
import { TestEnvironmentComponent } from './test-environment.component';
import { TestEnvironmentService } from './test-environment.service';
import { TestEnvironmentOverviewComponent } from './overview';
import { TestEnvironmentNewComponent } from './new';

import { ArtifactService } from '../../../artifact-runner/src/lib/artifact.service';

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
  ],
})
export class TestEnvironmentModule {}
