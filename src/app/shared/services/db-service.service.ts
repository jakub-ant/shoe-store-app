import {
  HttpClient
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  map,
  tap
} from 'rxjs/operators';
import { ShoppingCartUserID } from '../shopping-cart-user-id.model';
import {
  User
} from '../user.model';
import {
  AuthServiceService
} from './auth-service.service';

// class ShoppingCartUserID {
//   userId!: string | number;
//   shoppingCart: {
//     cartItemID: string | null,
//     productID: string
//   } [] = [];
//   shoppingCartItems: Object[] = [];
//   constructor(userId: string | number) {
//     this.userId = userId
//   }
// }

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {
 
  constructor(private httpClient: HttpClient, private authService: AuthServiceService) {}

  getItems() {
    return this.httpClient.get('https://shoe-store-d0b41-default-rtdb.firebaseio.com/shoes.json')
  }

  getItemById(idToken: string) {
    return this.httpClient.get(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/shoes/${idToken}.json`)

  }

  addToCart(user: User) {
    return this.httpClient.post(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/shopping-carts.json`, {
      userId: user.idToken,
      userShoppingCart: user.shoppingCart
    })
  }

  deleteCartItem(cartId:string){
    return this.httpClient.delete(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/shopping-carts/${cartId}.json`)
  }

  getCurrentCart(userId: string) {
    return this.httpClient.get(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/shopping-carts.json?"userId"=${userId}`).pipe(map(
      res => {
        if(!res) return null
        const shoppingCart = [];
        for (const [key, value] of Object.entries(res)) {
          const itemIdProductId = {
            shoppingCartitemId: key,
            productId: value
          }
          shoppingCart.push(itemIdProductId)
        }
        const shoppingCartUserID = new ShoppingCartUserID(shoppingCart[0].productId.userId)
        shoppingCart.forEach(item => {
          return item.productId.userShoppingCart.forEach((res: string) => {
            const newItem = {
              cartItemID: item.shoppingCartitemId,
              productID: res
            };
          shoppingCartUserID.shoppingCart.push(newItem)
          })
         })
        shoppingCartUserID.shoppingCart.forEach((shoppingCartitem) => this.getItemById(shoppingCartitem.productID)
          .subscribe((item: any) => {
            const product = item;
            console.log(product)
            product.cartItemId = shoppingCartitem.cartItemID
            shoppingCartUserID.shoppingCartItems.push(product)
          }, err => console.log(err)))
        console.log(shoppingCartUserID)
        return shoppingCartUserID
      }
    ), tap(shoppingCart => this.authService.loggedInUsersShoppingCart.next(shoppingCart)))

  }
}
