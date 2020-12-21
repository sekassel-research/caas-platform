import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ArtifactRunnerRoutingModule } from './artifact-runner-routing.module';
import { ArtifactComponent } from './artifact.component';
import { ArtifactService } from './artifact.service';
import { ArtifactEditComponent } from './edit';
import { ArtifactNewComponent } from './new';
import { ArtifactOverviewComponent } from './overview';

@NgModule({
  imports: [
    ArtifactRunnerRoutingModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  declarations: [
    ArtifactComponent,
    ArtifactEditComponent,
    ArtifactNewComponent,
    ArtifactOverviewComponent,
  ],
  providers: [
    ArtifactService,
  ]
})
export class ArtifactRunnerModule {}
