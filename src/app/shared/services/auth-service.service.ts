import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { error } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  key:string='AIzaSyAEwYFImEhIdUWl-xrVal5Zng-ALnQaInc';
  loggedInUser=new Subject<any|null>();
   


  constructor(private httpClient: HttpClient) { }

  signUp(email: string, password: string){
   return this.httpClient.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.key}`,{
      "email":email,"password":password,"returnSecureToken":true
    }).pipe(catchError(this.handleError))
  }

  signIn(email: string, password: string) {
    return this.httpClient.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.key}`,{
      "email":email,"password":password,"returnSecureToken":true
    }).pipe(catchError(this.handleError), tap(user=>{this.loggedInUser.next(user)}))
  }

  handleError(errorRes:HttpErrorResponse){
   return throwError(errorRes)
  }
}
