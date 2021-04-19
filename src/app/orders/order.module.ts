import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  OrdersComponent
} from './orders.component';
import {
  OrdersRoutingModule
} from './order-routing.module';
import { OrderItemComponent } from './order-item/order-item.component';
import { orderTotalPipe } from './order-total.pipe';
import { UiModule } from '../shared/ui/ui.module';



@NgModule({
  imports: [CommonModule,
    OrdersRoutingModule,
    UiModule
  ],
  declarations: [OrdersComponent,OrderItemComponent, orderTotalPipe],
  exports: [OrdersComponent, OrdersRoutingModule],
})
export class  OrderModule {}
