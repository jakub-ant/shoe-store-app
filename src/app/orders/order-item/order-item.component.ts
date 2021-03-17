import { Component, Input, OnInit } from '@angular/core';
import { Order } from 'src/app/shared/order.model';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.scss']
})
export class OrderItemComponent implements OnInit {
  @Input() order!:Order;
  showDetails = false;
  


  constructor() { }

  ngOnInit(): void {
  }

}
