import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {


  constructor(private httpClient: HttpClient) { }

  signUp(email: string, password: string){
   return this.httpClient.post('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAEwYFImEhIdUWl-xrVal5Zng-ALnQaInc',{
      "email":email,"password":password,"returnSecureToken":true
    })
  }
}
