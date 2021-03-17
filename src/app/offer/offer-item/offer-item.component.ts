import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OfferItem } from 'src/app/shared/offer-item.model';
import { DbServiceService } from 'src/app/shared/services/db-service.service';
import { User } from 'src/app/shared/user.model';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss']
})
export class OfferItemComponent implements OnInit {
  @Input() item!:OfferItem;
  @Input() loggedInUser!: User | null;
  @Output() showErrorMsg = new EventEmitter<boolean>();


  constructor(private dbService:DbServiceService) { }

  ngOnInit(): void {
  }
  addToCart(event: any) {
    const productId: string = event.target.dataset.id;
    console.log(productId)
    console.log(this.loggedInUser)
    if (!this.loggedInUser) return;
    this.loggedInUser.shoppingCart.length = 0;
    this.loggedInUser.shoppingCart.push(productId)
    this.dbService.addToCart(this.loggedInUser).subscribe(
      () => {
        // this.hideError()
        this.showErrorMsg.emit(false)
        if (this.loggedInUser) {
          this.dbService.getCurrentCart(this.loggedInUser.localId).subscribe()
        }
      },
      // () => this.showError()
      ()=>this.showErrorMsg.emit(true)
    )
  }



}
