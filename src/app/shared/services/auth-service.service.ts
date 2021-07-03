import {
  Injectable
} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import {
  catchError,
  map,
  tap
} from 'rxjs/operators';
import {
  BehaviorSubject,
  Observable,
  throwError
} from 'rxjs';
import {
  User
} from '../interfaces/user.interface';
import {
  ShoppingCartUserID
} from '../interfaces/shopping-cart-user-id.interface';
import {
  environment
} from '../../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  loggedInUser = new BehaviorSubject < User | null > (null);
  loggedInUsersShoppingCart = new BehaviorSubject < ShoppingCartUserID | null > (null)

  constructor(private readonly httpClient: HttpClient) {}

  private static getUserExpirationDate(user: User): User {
    const loggedInUser = user,
      currentDate = Date.now(),
      userExpiresIn = Number(loggedInUser.expiresIn),
      expirationDate = new Date(currentDate + userExpiresIn * 1000);
    loggedInUser.validTill = expirationDate;
    return loggedInUser;
  }

  private static createUserParams(email: string, password: string): HttpParams {
    return new HttpParams({
      fromObject: {
        "email": email,
        "password": password,
        "returnSecureToken": "true"
      }
    })
  }

  signUp(email: string, password: string): Observable < User > {
    return this.httpClient.post < User > (environment.signUpLink, AuthServiceService.createUserParams(email, password))
      .pipe(catchError(this.handleError));
  }

  signIn(email: string, password: string): Observable < User > {
    return this.httpClient.post < User > (environment.logInLink, AuthServiceService.createUserParams(email, password))
      .pipe(catchError(this.handleError),
        map(user => AuthServiceService.getUserExpirationDate(user)),
        tap(user => {
          this.loggedInUser.next(user);
          this.localStorageSaveUser(user);
        }));
  }

  handleError(errorRes: HttpErrorResponse): Observable < never > {
    return throwError(errorRes);
  }

  logOut(): void {
    localStorage.clear();
    this.loggedInUser.next(null);
  }
  localStorageSaveUser(user: User): void {
    localStorage.setItem('loggedUser', JSON.stringify(user));
  }
}