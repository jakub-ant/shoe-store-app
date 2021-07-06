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
  isLoading = false;
  errorMsg: ErrorMsg = {
    errorOccured: false,
    errorMsg: this.loggedInUser ? 
    'Wystąpił błąd' : 
    'Aby dodawać produkty do koszyka musisz się zalogować'
  }
  private offerSubscription!: Subscription;
  private authSubscription!: Subscription;

  constructor(private readonly authService: AuthServiceService, private readonly offerService: OfferService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authSubscription = this.authService.loggedInUser
      .subscribe(user => {
        this.hideError();
        if (user) {
          this.loggedInUser = user;
          this.loggedInUser.shoppingCart = [];
        }
      }, () => this.showError())
    this.offerSubscription = this.offerService.items
      .subscribe(items => {
        this.hideError();
        this.renderOffers(items);
      }, () => this.showError())
  }

  toggleError(event: boolean): void {
    event ? this.showError() : this.hideError();
  }
  showError(): void {
    this.errorMsg.errorOccured = true;
  }
  hideError(): void {
    this.errorMsg.errorOccured = false;
  }

  renderOffers(items: OfferItem[] | null): void {
    if (items) {
      this.itemsArray = items;
      this.isLoading = false;
    } else {
      this.showError();
    }
  }

  ngOnDestroy(): void {
    this.offerSubscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }
}
