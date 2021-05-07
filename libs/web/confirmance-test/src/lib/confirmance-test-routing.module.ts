import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ConfirmanceTestComponent } from './confirmance-test.component';
import { ConfirmanceTestEditComponent } from './edit';
import { ConfirmanceTestNewComponent } from './new';
import { ConfirmanceTestOverviewComponent } from './overview';

const routes: Routes = [
  {
    path: '',
    component: ConfirmanceTestComponent,
    children: [
      { path: 'overview', component: ConfirmanceTestOverviewComponent },
      { path: 'new', component: ConfirmanceTestNewComponent },
      { path: ':id', component: ConfirmanceTestEditComponent },
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfirmanceTestRoutingModule {}
