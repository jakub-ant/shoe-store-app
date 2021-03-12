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
} from '../shared/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedInUser!: User | null
  authSubscription!: Subscription;
  loggedInUsersShoppingCartSub!: Subscription;
  shoppingCartLength!: number;

  constructor(private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.loggedInUser
      .subscribe(user => {
          this.loggedInUser = user
        },
        err=>console.log(err));
    this.loggedInUsersShoppingCartSub = this.authService.loggedInUsersShoppingCart.subscribe(res => {
        if (res) {
          this.shoppingCartLength = res.shoppingCart.length
        } else {
          this.shoppingCartLength = 0
        }
      },
      err=>console.log(err))
  }
  ngOnDestroy() {
    if (this.authSubscription) this.authSubscription.unsubscribe()
    if (this.loggedInUsersShoppingCartSub) this.loggedInUsersShoppingCartSub.unsubscribe()
  }

  logOut() {
    this.authService.logOut()
  }
}
