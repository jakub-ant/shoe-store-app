import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  AuthServiceService
} from '../shared/services/auth-service.service';
import {
  DbServiceService
} from '../shared/services/db-service.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  shoppingCartSub!:Subscription
  shoppingCart!: any
  isLoading = false

  constructor(private authService: AuthServiceService, private dbService: DbServiceService) {}

  ngOnInit(): void {
    this.isLoading = true
    this.shoppingCartSub= this.authService.loggedInUsersShoppingCart.subscribe(
      items => {
        if(items) this.authService.localStorageSaveUserShoppingCart(items)
        this.shoppingCart = items;
        this.isLoading = false
      },
      err => console.log(err)
    )
  }

  deleteItem(event: any) {
    this.isLoading = true
    const cartId: string = event.target.dataset.cartId;
    const userId: string = event.target.dataset.userId;
    this.dbService.deleteCartItem(cartId).subscribe(() => this.dbService.getCurrentCart(userId).subscribe(() => this.isLoading = false))
  }

  ngOnDestroy(){
    this.shoppingCartSub.unsubscribe()
  }

}
