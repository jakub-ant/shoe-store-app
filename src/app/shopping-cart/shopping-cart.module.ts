import {
    NgModule
  } from '@angular/core';
  import {
    CommonModule
  } from '@angular/common';
import { ShoppingCartComponent } from './shopping-cart.component';
import { ShoppingCartRoutingModule } from './shopping-cart-routing';
import { UiModule } from '../shared/ui/ui.module';
 
  
  
  
  @NgModule({
    imports: [CommonModule, ShoppingCartRoutingModule, UiModule],
    declarations: [ShoppingCartComponent ],
    exports: [ShoppingCartComponent, ShoppingCartRoutingModule],
  })
  export class ShoppingCartModule {}
  