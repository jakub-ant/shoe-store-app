import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { User } from '../user.model';

class ShoppingCartUserID{
  userId!:string|number;
  shoppingCart:string[]=[]
  constructor(userId:string|number){
    this.userId=userId
  }
}


@Injectable({
  providedIn: 'root'
})
export class DbServiceService {

  constructor(private httpClient: HttpClient) { }

  getItems(){
    return this.httpClient.get('https://shoe-store-d0b41-default-rtdb.firebaseio.com/shoes.json')
  }

  addToCart(user:User){
    return this.httpClient.post(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/shopping-carts.json`, {userId:user.idToken,userShoppingCart: user.shoppingCart})
  }

  showCart(userId:string){
    return this.httpClient.get(`https://shoe-store-d0b41-default-rtdb.firebaseio.com/shopping-carts.json?"userId"=${userId}`).pipe(map(
      res=>{
        const shoppingCart = [];
        for (const [key, value] of Object.entries(res)) {
          shoppingCart.push(value)
        }
        const shoppingCartUserID= new ShoppingCartUserID(shoppingCart[0].userId)
          
        shoppingCart.forEach(item=>shoppingCartUserID.shoppingCart.push(...item.userShoppingCart))
        return shoppingCartUserID
      }
    ))

  }
}
