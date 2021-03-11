import {
  Component,
  OnInit
} from '@angular/core';
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
export class ShoppingCartComponent implements OnInit {
  shoppingCart!: any
  isLoading = false

  constructor(private authService: AuthServiceService, private dbService: DbServiceService) {}

  ngOnInit(): void {
    this.isLoading = true
    this.authService.loggedInUsersShoppingCart.subscribe(
      items => {
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

}
