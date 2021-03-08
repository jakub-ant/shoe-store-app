import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from '../shared/services/auth-service.service';
import {
  DbServiceService
} from '../shared/services/db-service.service';
import { User } from '../shared/user.model';

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
  offerSubscription!: Subscription;
  loggedInUser!: User;
  authSubscription!:Subscription
  

  constructor(private dbService: DbServiceService, private authService: AuthServiceService) {
  }

  renderOffers() {
    for (const key in this.items) {
      if (Object.prototype.hasOwnProperty.call(this.items, key)) {
        const element = this.items[key];
        element.id = key;
        this.itemsArray.push(element);
      }
    }
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.loggedInUser.subscribe(user=>{ this.loggedInUser=user; if(this.loggedInUser) this.loggedInUser.shoppingCart=[]})
    this.offerSubscription = this.dbService.getItems()
      .subscribe(items => {
        this.items = items
        this.renderOffers()
      },
      err=>console.log(err)
      )

  }

  ngOnDestroy(){
    if(this.offerSubscription) this.offerSubscription.unsubscribe()
    if(this.authSubscription)  this.authSubscription.unsubscribe()

  }

  addToCart(event:any){
        const productId:string = event.target.dataset.id;
    console.log(productId)
    console.log(this.loggedInUser)
    if(!this.loggedInUser) return;
    this.loggedInUser.shoppingCart.push(productId)
    this.dbService.addToCart(this.loggedInUser).subscribe(
     ()=> this.dbService.showCart(this.loggedInUser.idToken).subscribe(res=>console.log(res)),
     err=>console.log(err)
    )
    }

}
