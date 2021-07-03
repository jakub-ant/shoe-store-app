import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import {
  Injectable
} from '@angular/core';
import {
  Observable,
  throwError
} from 'rxjs';
import {
  catchError,
  map,
  tap
} from 'rxjs/operators';
import {
  environment
} from 'src/environments/environment';
import {
  OfferItem
} from '../interfaces/offer-item.interface';
import {
  Order
} from '../interfaces/order.interface';
import {
  ShoppingCartItem
} from '../interfaces/shopping-cart-item.interface';
import {
  ShoppingCartUserID
} from '../interfaces/shopping-cart-user-id.interface';
import {
  ShoppingCart
} from '../interfaces/shopping-cart.interface';
import {
  User
} from '../interfaces/user.interface';
import {
  AuthServiceService
} from './auth-service.service';


interface InterfaceItemIdProductId {
  shoppingCartitemId: string;
  productId: any;
}
interface addedItem {
  name: string;
}
class ShoppingCartUserIDClass implements ShoppingCartUserID {
  userId: string;
  constructor(userIdInput: string) {
    this.userId = userIdInput;
  }
  shoppingCart: ShoppingCart[] = [];
  shoppingCartItems: ShoppingCartItem[] = [];
}

class ItemIdProductId implements InterfaceItemIdProductId {
  shoppingCartitemId!: string;
  productId!: any;
  constructor(key: string, value: any) {
    this.shoppingCartitemId = key;
    this.productId = value;
  }
}

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private readonly httpClient: HttpClient, private readonly authService: AuthServiceService) {}

  getItems(): Observable < OfferItem[] > {
    return this.httpClient.get < OfferItem[] > (`${environment.dbShoe}.json`)
      .pipe(catchError(err => throwError(err)),
        map(items => APIService._mapReceivedProductObject(items)));
  }

  private static _mapReceivedProductObject(items: any): OfferItem[] {
    const receivedItems = items;
    const itemsArray: OfferItem[] = [];
    for (const key in receivedItems) {
      if (Object.prototype.hasOwnProperty.call(receivedItems, key)) {
        const element = receivedItems[key];
        element.id = key;
        itemsArray.push(element);
      }
    }
    return itemsArray;
  }

  private static createParams(token: string, paramName: string): HttpParams {
    if (paramName == "auth") {
      return new HttpParams({
        fromObject: {
          "provider": "anonymous",
          "auth": token
        }
      })
    } else (paramName == "uid")
      return new HttpParams({
        fromObject: {
          "provider": "anonymous",
          "uid": token
        }
      })
  }
  
  getItemById(id: string): Observable < ShoppingCartItem > {
    return this.httpClient.get < ShoppingCartItem > (`${environment.dbShoe}/${id}.json`)
      .pipe(catchError(err => throwError(err)));
  }

  addToCart(user: User): Observable < addedItem > {
    return this.httpClient.post < addedItem > (`${environment.dbShoppingCarts}.json`, {
        userId: user.localId,
        userShoppingCart: user.shoppingCart
      }, {
        params: APIService.createParams(user.idToken, "auth")
      })
      .pipe(catchError(err => throwError(err)));
  }

  addOrder(order: Order, userToken: string): Observable < addedItem > {
    return this.httpClient.post < addedItem > (`${environment.dbOrders}.json`, order, {
        params: APIService.createParams(userToken, "auth")
      })
      .pipe(catchError(err => throwError(err)));
  }


  deleteCartItem(cartId: string, userId: string, userToken: string): Observable < Object > {
    return this.httpClient.delete(`${environment.dbShoppingCarts}/${cartId}.json`, {
      params: APIService.createParams(userToken, "auth")
    })
  }

  getCurrentCart(userId: string, userToken: string): Observable < ShoppingCartUserIDClass | null > {
    return this.httpClient.get(`${environment.dbShoppingCarts}.json?orderBy="userId"&equalTo="${userId}"`, {
        params: APIService.createParams(userToken, "uid")
      })
      .pipe(catchError(err => throwError(err)),
        map(res => this._mapCurrentCart(res)),
        tap(shoppingCart => this.authService.loggedInUsersShoppingCart.next(shoppingCart)));
  }

  private _mapCurrentCart(response: any): ShoppingCartUserIDClass | null {
    const res = response;
    if (!res) {
      return null;
    } else {
      const shoppingCart = [];
      for (const [key, value] of Object.entries(res)) {
        shoppingCart.push(new ItemIdProductId(key, value))
      }
      if (!shoppingCart.length) {
        return null;
      } else {
        const shoppingCartUserID = new ShoppingCartUserIDClass(shoppingCart[0].productId.userId)
        shoppingCart.forEach((item: ItemIdProductId) => {
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
          }, err => throwError(err)))
        return shoppingCartUserID;
      }
    }
  }

  getOrders(userId: string, userToken: string): Observable < Order[] | null > {
    return this.httpClient.get(`${environment.dbOrders}.json?orderBy="userId"&equalTo="${userId}"`, {
        params: APIService.createParams(userToken, "uid")
      })
      .pipe(catchError(err => throwError(err)),
        map(orders => APIService._mapReceivedOrders(orders)))
  }
  private static _mapReceivedOrders(receivedOrders: any): Order[] | null {
    const orders = receivedOrders;
    if (!orders) {
      return null;
    } else {
      const ordersArr: Array < Order >= [];
      for (const [key, value] of Object.entries(orders)) {
        const mappedOrder: Order = value as Order;
        mappedOrder.orderId = key;
        ordersArr.push(mappedOrder);
      }

      return (ordersArr.length === 0) ? null : ordersArr;
    }
  }

  autoLogin(): void {
    const currentDate = new Date(Date.now());
    const loggedInUserString = localStorage.getItem('loggedUser');
    if (loggedInUserString) {
      const loggedInUser: User = JSON.parse(loggedInUserString);
      loggedInUser.validTill = new Date(String(loggedInUser.validTill));

      if (loggedInUser.validTill && (loggedInUser.validTill > currentDate)) {
        this.authService.loggedInUser.next(loggedInUser);
        this.getCurrentCart(loggedInUser.localId, loggedInUser.idToken).subscribe();
      } else {
        localStorage.clear();
        this.authService.loggedInUser.next(null);
      }
    }
  }
}