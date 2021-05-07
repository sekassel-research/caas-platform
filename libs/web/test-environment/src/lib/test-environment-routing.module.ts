import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TestEnvironmentComponent } from './test-environment.component';
import { TestEnvironmentOverviewComponent } from './overview';
import { TestEnvironmentNewComponent } from './new';
import { TestEnvironmentEditComponent } from './edit';

const routes: Routes = [
  {
    path: '',
    component: TestEnvironmentComponent,
    children: [
      { path: 'overview', component: TestEnvironmentOverviewComponent },
      { path: 'new', component: TestEnvironmentNewComponent },
      { path: ':id', component: TestEnvironmentEditComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestEnvironmentRoutingModule {}
