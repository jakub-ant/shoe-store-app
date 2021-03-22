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
  OfferService
} from './offer.service';
import{ErrorMsg} from '../shared/error-msg.model';
import { OfferItem } from '../shared/offer-item.model';


@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit, OnDestroy {
  items: any
  itemsArray: OfferItem[] = [];
  offerSubscription!: Subscription;
  loggedInUser!: User | null;
  authSubscription!: Subscription;
  isLoading: boolean = false
  errorMsg: ErrorMsg = {
    errorOccured: false,
    errorMsg: 'Wystąpił błąd'
  }

  constructor(private authService: AuthServiceService, private offerService: OfferService) {}
  toggleError(event:boolean){
    if(event){
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
  
  renderOffers() {
    for (const key in this.items) {
      if (Object.prototype.hasOwnProperty.call(this.items, key)) {
        const element = this.items[key];
        element.id = key;
        this.itemsArray.push(element);
      }
    }
    this.isLoading = false
  }

  ngOnInit(): void {
    this.isLoading = true
    this.authSubscription = this.authService.loggedInUser.subscribe(user => {
      this.hideError()
      if (user) {
        this.loggedInUser = user;
        this.loggedInUser.shoppingCart = []
      }
    }, () => this.showError())
    this.offerSubscription = this.offerService.items.subscribe(items => {
      this.hideError()
      this.items = items;
      this.renderOffers()
    }, () => this.showError())

  }

  ngOnDestroy() {
    if (this.offerSubscription) this.offerSubscription.unsubscribe()
    if (this.authSubscription) this.authSubscription.unsubscribe()
  }


}
