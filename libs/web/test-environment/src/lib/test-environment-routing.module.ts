import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TestEnvironmentComponent } from './test-environment.component';
import { TestEnvironmentOverviewComponent } from './overview';
import { TestEnvironmentNewComponent } from './new';

const routes: Routes = [
  {
    path: '',
    component: TestEnvironmentComponent,
    children: [
      { path: 'overview', component: TestEnvironmentOverviewComponent },
      { path: 'new', component: TestEnvironmentNewComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestEnvironmentRoutingModule {}
