import {
  Injectable
} from "@angular/core";
import {
  BehaviorSubject, Subscription
} from "rxjs";
import { DbServiceService } from "../shared/services/db-service.service";

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  items = new BehaviorSubject < any | null > (null);
  offerSubscription!: Subscription;
     

  constructor(private dbService: DbServiceService) {
this.fetchItems()
  }
  fetchItems() {
    this.offerSubscription = this.dbService.getItems()
      .subscribe(items => {
          this.items.next(items)
        },
        err => console.log(err)
      )
  }


}
