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
  OfferService
} from './offer.service';
import {
  ErrorMsg
} from '../shared/interfaces/error-msg.interface';
import {
  OfferItem
} from '../shared/interfaces/offer-item.interface';


@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit, OnDestroy {
  itemsArray: OfferItem[] = [];
  loggedInUser!: User | null;
  isLoading: boolean = false;
  errorMsg: ErrorMsg = {
    errorOccured: false,
    errorMsg: 'Wystąpił błąd'
  }
  private _offerSubscription!: Subscription;
  private _authSubscription!: Subscription;

  constructor(private readonly _authService: AuthServiceService, private readonly _offerService: OfferService) {}
  toggleError(event: boolean) {
    if (event) {
      this.showError()
    } else {
      this.hideError()
    }
  }
  showError() {
    this.errorMsg.errorOccured = true
  }
  hideError() {
    this.errorMsg.errorOccured = false
  }

  renderOffers(items: OfferItem[] | null) {
    if(items) {
      this.itemsArray = items;
      this.isLoading = false
    } else {
      this.showError();
    }
  }

  ngOnInit(): void {
    this.isLoading = true
    this._authSubscription = this._authService.loggedInUser.subscribe(user => {
      this.hideError()
      if (user) {
        this.loggedInUser = user;
        if (this.loggedInUser) {
          this.loggedInUser.shoppingCart = []
        }
      }
    }, () => this.showError())
    this._offerSubscription = this._offerService.items.subscribe(items => {
      this.hideError()
      this.renderOffers(items);
    }, () => this.showError())

  }

  ngOnDestroy() {
    this._offerSubscription.unsubscribe();
    this._authSubscription.unsubscribe();
  }

}
