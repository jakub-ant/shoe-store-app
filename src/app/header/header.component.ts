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
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations:[trigger('animateTheCart',[
    state('scaleUp', style({
      transform: 'scale(1.2)',
      color: 'black'
    })),
    state('scaleDown',style({
      transform: 'scale(1)',
    })),
  transition('scaleDown => scaleUp', [animate('0.75s')]),
  transition('scaleUp => ScaleDown', [animate('0.75s')])

  ])]
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedInUser!: User | null
  authSubscription!: Subscription;
  loggedInUsersShoppingCartSub!: Subscription;
  shoppingCartLength!: number;
  scale= false

  constructor(private authService: AuthServiceService) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.loggedInUser
      .subscribe(user => {
          this.loggedInUser = user
        },
        err=>console.log(err));
    this.loggedInUsersShoppingCartSub = this.authService.loggedInUsersShoppingCart.subscribe(res => {
        if (res) {
          this.scale = true
          setTimeout(()=>this.scale = false, 1500)
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
