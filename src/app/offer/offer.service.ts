import {
  Injectable
} from "@angular/core";
import {
  BehaviorSubject,
  Subscription
} from "rxjs";
import { OfferItem } from "../shared/interfaces/offer-item.interface";
import {
  DbServiceService
} from "../shared/services/db-service.service";

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  items = new BehaviorSubject < OfferItem[] | null > (null);
  private _offerSubscription!: Subscription;
  constructor(private readonly _dbService: DbServiceService) {
    this.fetchItems();
  }
  fetchItems() {
    this._offerSubscription = this._dbService.getItems()
      .subscribe(items => this.items.next(items),
        err=>err
      )
  }
}
