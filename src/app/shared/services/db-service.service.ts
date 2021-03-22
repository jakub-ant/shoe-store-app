import {
  HttpClient
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  throwError
} from 'rxjs';
import {
  catchError,
  map,
  tap
} from 'rxjs/operators';
import {
  Order
} from '../order.model';
import {
  ShoppingCartUserID
} from '../shopping-cart-user-id.model';
import {
  User
} from '../user.model';
import {
  AuthServiceService
} from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {
  // user!:User|null

  constructor(private httpClient: HttpClient, private authService: AuthServiceService) {
      // this.authService.loggedInUser.subscribe(user=>this.user=user)

  }

  getItems() {
    return this.httpClient.get('https://shoe-store-d0b41-default-rtdb.firebaseio.com/shoes.json')
  }

  getItemById(id: string) {
    return this.httpClient.get(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/shoes/${id}.json`)

  }

  addToCart(user: User) {
    return this.httpClient.post(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/shopping-carts.json`, {
      userId: user.localId,
      userShoppingCart: user.shoppingCart
    },        {
      params: {
        "provider": "anonymous",
        "auth": user.idToken
      }
    }).pipe(catchError(err => {
      return throwError(err);
    }))
  }

  addOrder(order: Order, userToken:string) {
    return this.httpClient.post(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/orders.json`, order,
    {
      params:  {
        "provider": "anonymous",
        "auth": userToken
      }
    })
  }


  deleteCartItem(cartId: string,userId:string, userToken:string) {
 
      return this.httpClient.delete(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/shopping-carts/${cartId}.json`,
      {
        params: {
          "provider": "anonymous",
          "auth": userToken
        }
      })

   }

  getCurrentCart(userId: string, userToken: string) {
    return this.httpClient.get(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/shopping-carts.json?orderBy="userId"&equalTo="${userId}"`
    , {
      params: {
        "provider": "anonymous",
        "uid": userToken
      }
    }).pipe(catchError(err => {
      return throwError(err);
    }), map(
      res => {
        if (!res) return null

        const shoppingCart = [];
        for (const [key, value] of Object.entries(res)) {
          const itemIdProductId = {
            shoppingCartitemId: key,
            productId: value
          }
          shoppingCart.push(itemIdProductId)
        }
        if (!shoppingCart.length) return null
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
        shoppingCartUserID.shoppingCart.forEach((shoppingCartItem) => this.getItemById(shoppingCartItem.productID)
          .subscribe((item: any) => {
            const product = item;
            product.cartItemId = shoppingCartItem.cartItemID
            shoppingCartUserID.shoppingCartItems.push(product)
          }, err => console.log(err)))
        return shoppingCartUserID
      }
    ), tap(shoppingCart => {this.authService.loggedInUsersShoppingCart.next(shoppingCart); console.log(shoppingCart) }))

  }

  getOrders(userId: string, userToken:string) {
    return this.httpClient.get(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/orders.json?orderBy="userId"&equalTo="${userId}"`,
    {
      params: {
        "provider": "anonymous",
        "uid": userToken
      }
    }
    )
      .pipe(catchError(err => throwError(err)), map(orders => {
        if (orders) {
          const ordersArr: Array < Order >= []
          for (const [key, value] of Object.entries(orders)) {
            const mappedOrder: Order = value;
            value.orderId = key;
            ordersArr.push(mappedOrder)
          }
          if (ordersArr.length === 0) {
            return null
          } else {
            return ordersArr
          }
        } else {
          return null
        }

      }))
  }

  autoLogin() {
    const loggedInUserString = localStorage.getItem('loggedUser');
    if (!loggedInUserString) return;
    const loggedInUser: User = JSON.parse(loggedInUserString)
    this.authService.loggedInUser.next(loggedInUser)
    this.getCurrentCart(loggedInUser.localId, loggedInUser.idToken).subscribe()
  }
}
