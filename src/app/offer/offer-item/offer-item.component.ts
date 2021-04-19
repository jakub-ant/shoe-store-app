import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import {
  OfferItem
} from 'src/app/shared/interfaces/offer-item.interface';
import {
  DbServiceService
} from 'src/app/shared/services/db-service.service';
import {
  User
} from 'src/app/shared/interfaces/user.interface';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations'
@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
  animations: [
    trigger('showHideMessage', [
      state('show', style({
        opacity: '1',
        backgroundColor: 'rgb(228, 236, 234)',
        transform: 'translateY(0%)',
        height: '100%'
      })),
      state('hide', style({
        opacity: '0',
        backgroundColor: 'white',
        display: 'hidden',
        transform: 'translateY(-20%)'
      })),
      transition('* => show', [animate('1s')]),
      transition('* => hide', [animate('1s')])
    ])
  ],

})
export class OfferItemComponent {
  @Input() item!: OfferItem;
  @Input() loggedInUser!: User | null;
  @Output() showErrorMsg = new EventEmitter < boolean > ();
  showMessage = false


  constructor(private readonly dbService: DbServiceService) {}

  addToCart(event: any) {
    const productId: string = event.target.dataset.id;
    if (!this.loggedInUser) {
      return;
    } else {
      this.loggedInUser.shoppingCart.length = 0;
      this.loggedInUser.shoppingCart.push(productId)
      this.dbService.addToCart(this.loggedInUser).subscribe(
        () => {
          this.showErrorMsg.emit(false);
          if (this.loggedInUser) {
            this.dbService.getCurrentCart(this.loggedInUser.localId, this.loggedInUser.idToken).subscribe(
              () => {
                this.showMessage = true;
                setTimeout(() => this.showMessage = false, 2000);
              }
            );
          }
        },
        () => this.showErrorMsg.emit(true)
      )
    }
  }
}
