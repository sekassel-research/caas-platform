import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthGuard } from './auth.guard';

@NgModule({
  imports: [CommonModule],
  providers: [
    AuthGuard
  ]
})
export class AuthModule {}
