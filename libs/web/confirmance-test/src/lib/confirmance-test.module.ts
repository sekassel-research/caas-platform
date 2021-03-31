import { NgModule } from '@angular/core';

import { ConfirmanceTestRoutingModule } from './confirmance-test-routing.module';
import { ConfirmanceTestComponent } from './confirmance-test.component';
import { ConfirmanceTestService } from './confirmance-test.service';

@NgModule({
  imports: [ConfirmanceTestRoutingModule],
  declarations: [ConfirmanceTestComponent],
  providers: [ConfirmanceTestService],
})
export class ConfirmanceTestModule {}
