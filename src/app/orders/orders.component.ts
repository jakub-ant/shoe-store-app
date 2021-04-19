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
  DbServiceService
} from '../shared/services/db-service.service';
import {
  User
} from '../shared/interfaces/user.interface';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders!: Array < Order > | null;
  loggedInUser!: User | null;
  isLoading = false;
  errorMsg: ErrorMsg = {
    errorOccured: false,
    errorMsg: 'Wystąpił błąd'
  }
  private _loggedInUserSub!: Subscription;
  constructor(private readonly _authService: AuthServiceService, private readonly _dbService: DbServiceService) {}


  ngOnInit(): void {
    this._loggedInUserSub = this._authService.loggedInUser.subscribe(user => {
        this.errorMsg.errorOccured = false;
        this.loggedInUser = user;
        if (this.loggedInUser) {
          this._dbService.getOrders(this.loggedInUser.localId, this.loggedInUser.idToken).subscribe(
            orders => {
              if (orders) {
                this.orders = orders;
                this.orders.sort((a, b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0))
              } else {
                this.orders = orders
              }
            },
            () => this.errorMsg.errorOccured = true
          )
        }
      },
      () => this.errorMsg.errorOccured = true);
  }
  ngOnDestroy() {
    if (this._loggedInUserSub) {
      this._loggedInUserSub.unsubscribe();
    }
  }
}
