import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  ReactiveFormsModule
} from '@angular/forms';
import {
  SignUpComponent
} from './sign-up.component';
import {
  SignUpRoutingModule
} from './sign-up-routing.module';
import { UiModule } from '../shared/ui/ui.module';



@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SignUpRoutingModule,
    UiModule
  ],
  declarations: [SignUpComponent],
  exports: [SignUpComponent,
    SignUpRoutingModule
  ],
})
export class SignUpModule {}
