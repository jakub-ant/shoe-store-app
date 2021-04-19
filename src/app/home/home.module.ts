import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
 
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ HomeComponent
  ],
   exports:[HomeComponent, HomeRoutingModule  ],
})
export class   HomeModule { }