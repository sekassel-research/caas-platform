import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { TestEnvironmentRoutingModule } from './test-environment-routing.module';
import { TestEnvironmentComponent } from './test-environment.component';
import { TestEnvironmentOverviewComponent } from './overview';
import { TestEnvironmentNewComponent } from './new';
import { TestEnvironmentEditComponent } from './edit';

@NgModule({
  imports: [TestEnvironmentRoutingModule, CommonModule, ReactiveFormsModule],
  declarations: [TestEnvironmentComponent, TestEnvironmentOverviewComponent, TestEnvironmentNewComponent, TestEnvironmentEditComponent],
})
export class TestEnvironmentModule {}
