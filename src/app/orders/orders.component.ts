import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  Subscription
} from 'rxjs';
import {
  ErrorMsg
} from '../shared/interfaces/error-msg.interface';
import {
  Order
} from '../shared/interfaces/order.interface';
import {
  AuthServiceService
} from '../shared/services/auth-service.service';
import {
  APIService
} from '../shared/services/api.service';
import {
  User
} from '../shared/interfaces/user.interface';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders!: Array < Order > | null;
  loggedInUser!: User | null;
  isLoading = false;
  errorMsg: ErrorMsg = {
    errorOccured: false,
    errorMsg: 'Wystąpił błąd'
  }
  private loggedInUserSub!: Subscription;
  constructor(private readonly authService: AuthServiceService, private readonly apiService: APIService) {}

  ngOnInit(): void {
    this.loggedInUserSub = this.authService.loggedInUser
    .subscribe(user => {
        this.errorMsg.errorOccured = false;
        this.loggedInUser = user;
        if (this.loggedInUser) {
          this.apiService.getOrders(this.loggedInUser.localId, this.loggedInUser.idToken)
            .subscribe(
              orders => {
                this.orders = orders;
                this.orders?this.orders.sort((a, b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0)):null;
              },
              () => this.errorMsg.errorOccured = true
            )
        }
      },
      () => this.errorMsg.errorOccured = true);
  }
  ngOnDestroy():void {
    this.loggedInUserSub ? this.loggedInUserSub.unsubscribe():null;
  }
}