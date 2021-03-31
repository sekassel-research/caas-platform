import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfirmanceTestRoutingModule } from './confirmance-test-routing.module';
import { ConfirmanceTestComponent } from './confirmance-test.component';
import { ConfirmanceTestService } from './confirmance-test.service';
import { ConfirmanceTestEditComponent } from './edit';
import { ConfirmanceTestNewComponent } from './new';
import { ConfirmanceTestOverviewComponent } from './overview';

@NgModule({
  imports: [ConfirmanceTestRoutingModule, CommonModule, ReactiveFormsModule],
  declarations: [ConfirmanceTestComponent, ConfirmanceTestEditComponent, ConfirmanceTestNewComponent, ConfirmanceTestOverviewComponent],
  providers: [ConfirmanceTestService],
})
export class ConfirmanceTestModule {}
