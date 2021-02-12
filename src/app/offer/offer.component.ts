import { Component, OnInit } from '@angular/core';
import { DbServiceService } from '../shared/services/db-service.service';

interface Item {
  "id": string,
  "name": string,
  "desc": {"gender": string, "size": number},
  "price": number,
  "availableItems": number,
  "imageURL": string
}
@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {
  items: any
  itemsArray: Item [] = [];

  constructor(private dbService:DbServiceService) { }

  ngOnInit(): void {
    this.dbService.getItems()
    .subscribe(items=>{this.items = items;
      for (const key in this.items) {
        if (Object.prototype.hasOwnProperty.call(this.items, key)) {
          const element = this.items[key];
          element.id = key;
          this.itemsArray.push(element);
          console.log(this.itemsArray)
        }
      }
    })

  }

}
