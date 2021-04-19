import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../shared/interfaces/order.interface';
 
@Pipe({name: 'orderTotal'})
export class orderTotalPipe implements PipeTransform {
  transform(value: Order): number {
    let totalPrice = 0;
    if(value) value.shoppingCartItems.forEach(item=>totalPrice+=item.price)
    return totalPrice
  }
}