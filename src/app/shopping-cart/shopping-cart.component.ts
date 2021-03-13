import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  Subscription
} from 'rxjs';
import {
  ErrorMsg
} from '../shared/error-msg.model';
import {
  AuthServiceService
} from '../shared/services/auth-service.service';
import {
  DbServiceService
} from '../shared/services/db-service.service';
import {
  ShoppingCartUserID
} from '../shared/shopping-cart-user-id.model';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  shoppingCartSub!: Subscription;
  deleteCartItemSub!: Subscription;
  getCurrentCartSub!: Subscription
  shoppingCart!: ShoppingCartUserID | null;
  isLoading = false;
  errorMsg: ErrorMsg = {
    errorOccured: false,
    errorMsg: 'Wystąpił błąd'
  }


  constructor(private authService: AuthServiceService, private dbService: DbServiceService) {}
  get totalValue(): number {
    if (this.shoppingCart && !this.isLoading) {
      const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
      const prices: Array < number > = []
      this.shoppingCart.shoppingCartItems.forEach(item => prices.push(item.price))
      if (prices.length === 0) {
        return 0
      } else {
        let totalPrice: number = prices.reduce(reducer)
        return totalPrice
      }
    } else {
      return 0
    }

  }
  ngOnInit(): void {
    this.isLoading = true
    this.shoppingCartSub = this.authService.loggedInUsersShoppingCart.subscribe(
      items => {
        this.errorMsg.errorOccured = false
        this.shoppingCart = items;
        this.isLoading = false
        console.log(this.shoppingCart)
      },
      () => this.errorMsg.errorOccured = false
    )
  }

  deleteItem(event: any) {
    this.isLoading = true
    const cartId: string = event.target.dataset.cartId;
    const userId: string = event.target.dataset.userId;

    this.deleteCartItemSub = this.dbService.deleteCartItem(cartId)
      .subscribe(() => {
        return this.getCurrentCartSub = this.dbService.getCurrentCart(userId)
          .subscribe(items => {
              this.shoppingCart = items;
              this.errorMsg.errorOccured = false;
              this.isLoading = false;
            },
            () => this.errorMsg.errorOccured = true);
      })
  }

  ngOnDestroy() {
    if (this.shoppingCartSub) this.shoppingCartSub.unsubscribe()
    if (this.deleteCartItemSub) this.deleteCartItemSub.unsubscribe()
    if (this.getCurrentCartSub) this.getCurrentCartSub.unsubscribe()
  }

}
