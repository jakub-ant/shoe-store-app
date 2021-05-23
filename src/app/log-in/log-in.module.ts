import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogInComponent } from './log-in.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LogInRoutingModule } from './log-in-routing.module';
import { UiModule } from '../shared/ui/ui.module';

 
  
@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiModule,
    LogInRoutingModule
   ],
  declarations: [LogInComponent  ],
   exports:[LogInComponent, LogInRoutingModule],
})
export class LogInModule { }