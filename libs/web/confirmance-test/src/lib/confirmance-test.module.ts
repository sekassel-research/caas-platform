import { NgModule } from '@angular/core';

import { TestComponent } from './test';
import { ConfirmanceTestRoutingModule } from './confirmance-test-routing.module';

@NgModule({
  imports: [
    ConfirmanceTestRoutingModule
  ],
  declarations: [
    TestComponent
  ]
})
export class ConfirmanceTestModule {}
