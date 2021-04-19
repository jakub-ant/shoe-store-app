import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  OfferItemComponent
} from './offer-item/offer-item.component';
import {
  OfferComponent
} from './offer.component';
import {
  OfferRoutingModule
} from './offer-routing.module';
 


@NgModule({
  imports: [
    CommonModule,
    OfferRoutingModule,
   ],
  declarations: [OfferItemComponent, OfferComponent],
  exports: [OfferItemComponent, OfferComponent, OfferRoutingModule],
})
export class OfferModule {}
