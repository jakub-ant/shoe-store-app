import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';
import { User } from '../user.model';
import { ShoppingCartUserID } from '../shopping-cart-user-id.model';
import {environment} from '../../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  loggedInUser=new BehaviorSubject<User|null>(null);
  loggedInUsersShoppingCart=new BehaviorSubject<ShoppingCartUserID|null>(null)
   
  constructor(private httpClient: HttpClient) { }

  static getUserExpirationDate(user:User):User{
    const loggedInUser = user
    const currentDate =  Date.now();
    const userExpiresIn = +loggedInUser.expiresIn
    const expirationDate = new Date(currentDate + userExpiresIn*1000)
    loggedInUser.validTill = expirationDate
    return loggedInUser
  }

  signUp(email: string, password: string){
   return this.httpClient.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.API_KEY}`,{
      "email":email,"password":password,"returnSecureToken":true
    }).pipe(catchError(this.handleError))
  }

  signIn(email: string, password: string) {
    return this.httpClient.post <User>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.API_KEY}`,{
      "email":email,"password":password,"returnSecureToken":true
    }).pipe(catchError(this.handleError),map(user=>AuthServiceService.getUserExpirationDate(user)), tap(user=>{this.loggedInUser.next(user); this.localStorageSaveUser(user)}))
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
