import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  Router
} from '@angular/router';
import {
  Subscription
} from 'rxjs';
import {
  ErrorMsg
} from '../shared/interfaces/error-msg.interface';
import {
  Order
} from '../shared/interfaces/order.interface';
import {
  AuthServiceService
} from '../shared/services/auth-service.service';
import {
  APIService
} from '../shared/services/api.service';
import {
  ShoppingCartUserID
} from '../shared/interfaces/shopping-cart-user-id.interface';
import {
  User
} from '../shared/interfaces/user.interface';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  shoppingCart!: ShoppingCartUserID | null;
  user!: User | null;
  isLoading = false;
  errorMsg: ErrorMsg = {
    errorOccured: false,
    errorMsg: 'Wystąpił błąd'
  }
  private shoppingCartSub!: Subscription;
  private deleteCartItemSub!: Subscription;
  private getCurrentCartSub!: Subscription;
  private userSub!: Subscription
  constructor(private readonly authService: AuthServiceService, private readonly apiService: APIService, private readonly router: Router) {}
  get totalValue(): number {
    if (this.shoppingCart && !this.isLoading) {
      const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue;
      const prices: Array < number > = [];
      this.shoppingCart.shoppingCartItems.forEach(item => prices.push(item.price));
      return (prices.length === 0) ? 0 : prices.reduce(reducer);
    } else {
      return 0;
    }

  }
  ngOnInit(): void {
    this.isLoading = true;
    this.authService.loggedInUser.subscribe(user => this.user = user);
    this.shoppingCartSub = this.authService.loggedInUsersShoppingCart.subscribe(
      items => {
        this.errorMsg.errorOccured = false
        this.shoppingCart = items;
        this.isLoading = false
      },
      () => this.errorMsg.errorOccured = true
    )
  }

  deleteItem(cartId: string, userId: string) {
    this.isLoading = true;
    if (this.user?.idToken) {
      this.deleteCartItemSub = this.apiService.deleteCartItem(cartId, userId, this.user?.idToken)
        .subscribe(() => {
            if (this.user?.idToken) {
              this.getCurrentCartSub = this.apiService.getCurrentCart(userId, this.user?.idToken)
                .subscribe(items => {
                    this.shoppingCart = items;
                    this.errorMsg.errorOccured = false;
                    this.isLoading = false;
                  },
                  err => this.errorMsg.errorOccured = true)
            };
          },
          () => this.errorMsg.errorOccured = true)
    }
  }

  onClickdeleteItem(event: any): void {
    const cartId = event.target.dataset.cartId;
    const userId = event.target.dataset.userId;
    this.deleteItem(cartId, userId);
  }

  addNewOrder() {
    if (this.shoppingCart) {
      const currentDate = {
        date: new Date()
      }
      const newOrder: Order = Object.assign(this.shoppingCart, currentDate)
      if (this.user?.idToken)
        this.apiService.addOrder(newOrder, this.user.idToken).subscribe(
          () => {
            if (this.shoppingCart) this.shoppingCart.shoppingCart.forEach(item => {
              if (item.cartItemID) {
                const cartItemID: string = item.cartItemID;
                const userId = newOrder.userId;
                this.deleteItem(cartItemID, userId);
              }
            })
            this.errorMsg.errorOccured = false;
            setTimeout(() => this.router.navigate(['orders']), 500);
          },
          () => this.errorMsg.errorOccured = true
        )
    } else {
      return
    }

  }
  unsubscribeActiveSubs(): void {
    if (this.shoppingCartSub) {
      this.shoppingCartSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.getCurrentCartSub) {
      this.getCurrentCartSub.unsubscribe();
    }
    if (this.deleteCartItemSub) {
      this.deleteCartItemSub.unsubscribe();
    }
  }
  ngOnDestroy(): void {
    this.unsubscribeActiveSubs();
  }
}
