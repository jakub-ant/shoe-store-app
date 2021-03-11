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
  loggedInUser!: User |null
  authSubscription!: Subscription;
  shoppingCartLength!: number

  constructor(private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.loggedInUser.subscribe(user => this.loggedInUser = user);
    this.authService.loggedInUsersShoppingCart.subscribe(res => {
      if (res) {
         this.shoppingCartLength = res.shoppingCart.length
      } else {
        this.shoppingCartLength = 0
      }
    })
  }
  ngOnDestroy() {
    if (this.authSubscription) this.authSubscription.unsubscribe()
  }

  logOut() {
    this.authService.logOut()
  }
}
