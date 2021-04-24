import {
  HttpClient
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
import { OfferItem } from '../interfaces/offer-item.interface';
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



class ShoppingCartUserIDClass implements ShoppingCartUserID {
  userId: string;
  constructor(userIdInput: string) {
    this.userId = userIdInput;
  }
  shoppingCart: ShoppingCart[] = [];
  shoppingCartItems: ShoppingCartItem[] = [];
}



@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  constructor(private readonly _httpClient: HttpClient, private readonly _authService: AuthServiceService) {}

  getItems(): Observable<OfferItem[]> {
    return this._httpClient.get(`${environment.dbShoe}.json`)
      .pipe(catchError(err => throwError(err))
      ,map(items => DbServiceService._mapReceivedProductObject(items)));
  }
  private static _mapReceivedProductObject(items: any): OfferItem[]  {
    const receivedItems = items;
    const itemsArray: OfferItem[] = []
    for (const key in receivedItems) {
      if (Object.prototype.hasOwnProperty.call(receivedItems, key)) {
        const element = receivedItems[key];
        element.id = key;
        itemsArray.push(element);
      }
    }
    return itemsArray;
  }

  getItemById(id: string) {
    return this._httpClient.get(`${environment.dbShoe}/${id}.json`)
      .pipe(catchError(err => throwError(err)));
  }

  addToCart(user: User) {
    return this._httpClient.post(`${environment.dbShoppingCarts}.json`, {
        userId: user.localId,
        userShoppingCart: user.shoppingCart
      }, {
        params: {
          "provider": "anonymous",
          "auth": user.idToken
        }
      })
      .pipe(catchError(err => throwError(err)))
  }

  addOrder(order: Order, userToken: string) {
    return this._httpClient.post(environment.dbOrders, order, {
        params: {
          "provider": "anonymous",
          "auth": userToken
        }
      })
      .pipe(catchError(err => throwError(err)))
  }


  deleteCartItem(cartId: string, userId: string, userToken: string) {
    return this._httpClient.delete(`${environment.dbShoppingCarts}/${cartId}.json`, {
      params: {
        "provider": "anonymous",
        "auth": userToken
      }
    })
  }

  getCurrentCart(userId: string, userToken: string) {
    return this._httpClient.get(`${environment.dbShoppingCarts}.json?orderBy="userId"&equalTo="${userId}"`, {
        params: {
          "provider": "anonymous",
          "uid": userToken
        }
      })
      .pipe(catchError(err => {
          return throwError(err);
        }),
        map(
          res => {
            if (res) {
              interface InterfaceItemIdProductId {
                shoppingCartitemId: string;
                productId: any;
              }
              class ItemIdProductId implements InterfaceItemIdProductId {
                shoppingCartitemId!: string;
                productId!: any;
                constructor(key: string, value: any) {
                  this.shoppingCartitemId = key;
                  this.productId = value;
                }
              }
              const shoppingCart = [];
              for (const [key, value] of Object.entries(res)) {
                shoppingCart.push(new ItemIdProductId(key, value))
              }
              if (shoppingCart.length) {
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
              } else {
                return null;
              }
            } else {
              return null;
            }
          }
        ), tap(shoppingCart => this._authService.loggedInUsersShoppingCart.next(shoppingCart)))
  }

  getOrders(userId: string, userToken: string) {
    return this._httpClient.get(`${environment.dbOrders}.json?orderBy="userId"&equalTo="${userId}"`, {
        params: {
          "provider": "anonymous",
          "uid": userToken
        }
      })
      .pipe(catchError(err => throwError(err)),
       map(orders => {
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

  autoLogin():void {
    const currentDate = new Date(Date.now());
    const loggedInUserString = localStorage.getItem('loggedUser');
    if (loggedInUserString) {
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
}
