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
} from '../interfaces/order.interface';
import {
  ShoppingCartUserID
} from '../interfaces/shopping-cart-user-id.interface';
import {
  User
} from '../interfaces/user.interface';
import {
  AuthServiceService
} from './auth-service.service';

class ShoppingCartUserIDClass implements ShoppingCartUserID {
  userId: string;
  constructor( userIdInput: string) {
    this.userId = userIdInput;
  }
  shoppingCart: {
    cartItemID: string | null;productID: string;
  } [] = [];
  shoppingCartItems: {
    cartItemId: string
    desc: {
      gender: string,
      size: number
    }
    imageURL: string
    name: string
    price: number
  } [] = [];
}

@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  constructor(private readonly _httpClient: HttpClient, private readonly _authService: AuthServiceService) {

  }

  getItems() {
    return this._httpClient.get('https://shoe-store-d0b41-default-rtdb.firebaseio.com/shoes.json')
    .pipe(catchError(err =>throwError(err)))
  }

  getItemById (id: string) {
    return this._httpClient.get(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/shoes/${id}.json`)
    .pipe(catchError(err =>throwError(err)))

  }

  addToCart(user: User) {
    return this._httpClient.post(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/shopping-carts.json`, {
      userId: user.localId,
      userShoppingCart: user.shoppingCart
    }, {
      params: {
        "provider": "anonymous",
        "auth": user.idToken
      }
    })
    .pipe(catchError(err => {
      return throwError(err);
    }))
  }

  addOrder(order: Order, userToken: string) {
    return this._httpClient.post(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/orders.json`, order, {
      params: {
        "provider": "anonymous",
        "auth": userToken
      }
    }).pipe(catchError(err =>throwError(err)))
  }


  deleteCartItem(cartId: string, userId: string, userToken: string) {

    return this._httpClient.delete(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/shopping-carts/${cartId}.json`, {
      params: {
        "provider": "anonymous",
        "auth": userToken
      }
    })

  }

  getCurrentCart(userId: string, userToken: string) {
    return this._httpClient.get(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/shopping-carts.json?orderBy="userId"&equalTo="${userId}"`, {
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
        const shoppingCartUserID = new ShoppingCartUserIDClass(shoppingCart[0].productId.userId)
        shoppingCart.forEach(item => {
          return item.productId.userShoppingCart.forEach((res: string) => {
            const newItem = {
              cartItemID: item.shoppingCartitemId,
              productID: res
            };
            shoppingCartUserID.shoppingCart.push(newItem);
          })
        })
        shoppingCartUserID.shoppingCart.forEach((shoppingCartItem) => this.getItemById(shoppingCartItem.productID)
          .subscribe((item: any) => {
            const product = item;
            product.cartItemId = shoppingCartItem.cartItemID;
            shoppingCartUserID.shoppingCartItems.push(product);
          }, err =>   throwError(err))) 

        return shoppingCartUserID
      }
    ), tap(shoppingCart => this._authService.loggedInUsersShoppingCart.next(shoppingCart)))

  }

  getOrders(userId: string, userToken: string) {
    return this._httpClient.get(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/orders.json?orderBy="userId"&equalTo="${userId}"`, {
        params: {
          "provider": "anonymous",
          "uid": userToken
        }
      })
      .pipe(catchError(err => throwError(err)), map(orders => {
        if (orders) {
          const ordersArr: Array < Order >= []
          for (const [key, value] of Object.entries(orders)) {
            const mappedOrder: Order = value;
            value.orderId = key;
            ordersArr.push(mappedOrder);
          }
          if (ordersArr.length === 0) {
            return null;
          } else {
            return ordersArr;
          }
        } else {
          return null
        }

      }))
  }

  autoLogin() {
    const currentDate = new Date(Date.now());
    const loggedInUserString = localStorage.getItem('loggedUser');
    if (!loggedInUserString) return;
    const loggedInUser: User = JSON.parse(loggedInUserString);
    loggedInUser.validTill = new Date(String(loggedInUser.validTill));
    if (loggedInUser.validTill && (loggedInUser.validTill > currentDate)) {
      this._authService.loggedInUser.next(loggedInUser);
      this.getCurrentCart(loggedInUser.localId, loggedInUser.idToken).subscribe();
    } else {
      localStorage.clear();
      this._authService.loggedInUser.next(null);
    }
  }
}
