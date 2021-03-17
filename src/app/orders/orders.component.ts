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
} from '../shared/error-msg.model';
import {
  Order
} from '../shared/order.model';
import {
  AuthServiceService
} from '../shared/services/auth-service.service';
import {
  DbServiceService
} from '../shared/services/db-service.service';
import {
  User
} from '../shared/user.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  orders!: Array < Order > |null;
  loggedInUser!: User | null;
  loggedInUserSub!: Subscription
  isLoading = false;
  errorMsg: ErrorMsg = {
    errorOccured: false,
    errorMsg: 'Wystąpił błąd'
  }

  constructor(private authService: AuthServiceService, private dbService: DbServiceService) {}


  ngOnInit(): void {
    this.loggedInUserSub = this.authService.loggedInUser.subscribe(user => {
        this.errorMsg.errorOccured = false
        this.loggedInUser = user;
        if (this.loggedInUser) {
          this.dbService.getOrders(this.loggedInUser.localId).subscribe(
            orders => {
              if (orders) {
                this.orders = orders;
                console.log(orders)
              }else {
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
    this.loggedInUserSub.unsubscribe()
  }

}
