import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArtifactComponent } from './artifact.component';
import { ArtifactEditComponent } from './edit';
import { ArtifactNewComponent } from './new';
import { ArtifactOverviewComponent } from './overview';

const routes: Routes = [
  {
    path: '', component: ArtifactComponent, children: [
      { path: 'overview', component: ArtifactOverviewComponent },
      { path: 'new', component: ArtifactNewComponent },
      { path: ':id', component: ArtifactEditComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtifactRunnerRoutingModule {}
