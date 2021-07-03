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
      transform: 'scale(1.1)',
      color: 'black'
    })),
    state('scaleDown', style({
      transform: 'scale(1)',
    })),
    transition('scaleDown <=> scaleUp', [animate('.5s')]),
  ])]
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedInUser!: User | null;
  shoppingCartLength!: number;
  scale!: boolean | undefined;
  userError: ErrorMsg = {
    errorMsg: 'Wystąpił błąd',
    errorOccured: false
  };
  shoppingCartError: ErrorMsg = {
    errorMsg: 'Wystąpił błąd',
    errorOccured: false
  }
  private authSubscription!: Subscription;
  private loggedInUsersShoppingCartSub!: Subscription;
  private triggerAnimation() {
    if (typeof this.scale == 'undefined') {
      //Blocks the animation if the component is initialized.
      this.scale = false;
    } else {
      this.scale = true;
      setTimeout(() => this.scale = false, 1000);
    }
  }

  constructor(private readonly authService: AuthServiceService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.loggedInUser
      .subscribe(user => {
          this.userError.errorOccured = false;
          this.loggedInUser = user;
          this.loggedInUser ? null : this.scale = undefined;
        },
        () => {
          this.userError.errorOccured = true;
          this.scale = undefined;
        });
    this.loggedInUsersShoppingCartSub = this.authService.loggedInUsersShoppingCart
      .subscribe(res => {
          if (res) {
            this.triggerAnimation();
            this.shoppingCartLength = res.shoppingCart.length;
          } else {
            this.shoppingCartLength = 0;
          }
          this.shoppingCartError.errorOccured = false;
        },
        () => this.shoppingCartError.errorOccured = true);
  }
  logOut(): void {
    this.authService.logOut();
  }
  private unsubscribeInitializedSubs(): void {
    this.authSubscription ? this.authSubscription.unsubscribe() : null;
    this.loggedInUsersShoppingCartSub ? this.loggedInUsersShoppingCartSub.unsubscribe() : null;
  }
  ngOnDestroy(): void {
    this.unsubscribeInitializedSubs();
  }
}