import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {
  DbServiceService
} from '../shared/services/db-service.service';

interface Item {
  "id": string,
  "name": string,
  "desc": {
    "gender": string,
    "size": number
  },
  "price": number,
  "availableItems": number,
  "imageURL": string
}
@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit, OnDestroy {
  items: any
  itemsArray: Item[] = [];
  offerSubscription: any;
  

  constructor(private dbService: DbServiceService) {
  }

  renderOffers() {
    for (const key in this.items) {
      if (Object.prototype.hasOwnProperty.call(this.items, key)) {
        const element = this.items[key];
        element.id = key;
        this.itemsArray.push(element);
        console.log(this.itemsArray)
      }
    }
  }

  ngOnInit(): void {
    this.offerSubscription = this.dbService.getItems()
      .subscribe(items => {
        this.items = items
        this.renderOffers()
      },
      err=>console.log(err)
      )

  }

  ngOnDestroy(){
    this.offerSubscription.unsubscribe()
  }

  addToCart(event:any){
    const elementId:number = event.target.dataset.index;
    console.log(this.itemsArray[elementId].id)
     }

}
