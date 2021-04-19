import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  Subscription
} from 'rxjs';
import {
  AuthServiceService
} from '../shared/services/auth-service.service';
import {
  User
} from '../shared/interfaces/user.interface';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations'
import {
  ErrorMsg
} from '../shared/interfaces/error-msg.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [trigger('animateTheCart', [
    state('scaleUp', style({
      transform: 'scale(1.2)',
      color: 'black'
    })),
    state('scaleDown', style({
      transform: 'scale(1)',
    })),
    transition('scaleDown => scaleUp', [animate('0.75s')]),
    transition('scaleUp => ScaleDown', [animate('0.75s')])

  ])]
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedInUser!: User | null;
  shoppingCartLength!: number;
  scale!: boolean;
  userError: ErrorMsg = {
    errorMsg: 'Wystąpił błąd',
    errorOccured: false
  };
  shoppingCartError:ErrorMsg={
    errorMsg: 'Wystąpił błąd',
    errorOccured: false
  }
  private _authSubscription!: Subscription;
  private _loggedInUsersShoppingCartSub!: Subscription;

  constructor(private readonly _authService: AuthServiceService) {}

  ngOnInit(): void {
    this._authSubscription = this._authService.loggedInUser
      .subscribe(user => {
          this.userError.errorOccured = false;
          this.loggedInUser = user;
        },
        () => this.userError.errorOccured = true);
    this._loggedInUsersShoppingCartSub = this._authService.loggedInUsersShoppingCart
      .subscribe(res => {
          if (res) {
            if (typeof this.scale == 'undefined') {
              //Blocks the animation if the component is initialized.
              this.scale = false;
            } else {
              this.scale = true;
              setTimeout(() => this.scale = false, 1000);
            }
            this.shoppingCartLength = res.shoppingCart.length;
          } else {
            this.shoppingCartLength = 0;
          }
          this.shoppingCartError.errorOccured = false;
        },
        err => this.shoppingCartError.errorOccured = true);
  }
  logOut() {
    this._authService.logOut();
  }
  ngOnDestroy() {
    if (this._authSubscription) {
      this._authSubscription.unsubscribe();
    }
    if (this._loggedInUsersShoppingCartSub) {
      this._loggedInUsersShoppingCartSub.unsubscribe();
    }
  }

}
