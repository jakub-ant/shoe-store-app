import {
  Injectable
} from "@angular/core";
import {
  BehaviorSubject,
  Subscription
} from "rxjs";
import {
  OfferItem
} from "../shared/interfaces/offer-item.interface";
import {
  APIService
} from "../shared/services/api.service";

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  items = new BehaviorSubject < OfferItem[] | null > (null);
  private offerSubscription!: Subscription;
  constructor(private readonly apiService: APIService) {
    this.fetchItems();
  }
  fetchItems() {
    this.offerSubscription = this.apiService.getItems()
      .subscribe(items => this.items.next(items),
        err => err
      )
  }
}