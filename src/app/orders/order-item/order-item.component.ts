import {
  Component,
  Input
} from '@angular/core';
import {
  Order
} from 'src/app/shared/interfaces/order.interface';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
})
export class OrderItemComponent {
  @Input() order!: Order;
  showDetails = false;
}