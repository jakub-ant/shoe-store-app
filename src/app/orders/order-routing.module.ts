import {
  NgModule
} from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';
import {
  AuthGuard
} from '../shared/authGuard/auth.guard';
import {
  OrdersComponent
} from './orders.component';

const routes: Routes = [{
  path: 'orders',
  component: OrdersComponent,
  canActivate: [AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule {}
