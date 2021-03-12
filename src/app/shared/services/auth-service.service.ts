import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from '../user.model';
import { ShoppingCartUserID } from '../shopping-cart-user-id.model';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  key:string='AIzaSyAEwYFImEhIdUWl-xrVal5Zng-ALnQaInc';
  loggedInUser=new BehaviorSubject<User|null>(null);
  loggedInUsersShoppingCart=new BehaviorSubject<ShoppingCartUserID|null>(null)
   


  constructor(private httpClient: HttpClient) { }

  signUp(email: string, password: string){
   return this.httpClient.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.key}`,{
      "email":email,"password":password,"returnSecureToken":true
    }).pipe(catchError(this.handleError))
  }

  signIn(email: string, password: string) {
    return this.httpClient.post <User>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.key}`,{
      "email":email,"password":password,"returnSecureToken":true
    }).pipe(catchError(this.handleError), tap(user=>{this.loggedInUser.next(user); this.localStorageSaveUser(user)}))
  }

  handleError(errorRes:HttpErrorResponse){
   return throwError(errorRes)
  }

  logOut(){
    localStorage.clear()
    this.loggedInUser.next(null)
  }
  localStorageSaveUser(user:User){
    localStorage.setItem('loggedUser', JSON.stringify(user))
  }


 
 
}
