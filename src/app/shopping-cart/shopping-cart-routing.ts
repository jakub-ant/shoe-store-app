import {
    NgModule
  } from '@angular/core';
  import {
    RouterModule,
    Routes
  } from '@angular/router';
  import {
    AuthGuard
  } from '../shared/auth.guard';
import { ShoppingCartComponent } from './shopping-cart.component';
 
  
  const routes: Routes = [  {
    path:'shopping-cart',
    component:ShoppingCartComponent,
    canActivate:[AuthGuard]
  },];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class ShoppingCartRoutingModule {}
  