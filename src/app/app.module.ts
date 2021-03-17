import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogInComponent } from './log-in/log-in.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { OfferComponent } from './offer/offer.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';;
import { HttpClientModule } from '@angular/common/http';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { OrdersComponent } from './orders/orders.component';
import { orderTotalPipe } from './shared/order-total.pipe';
import { OrderItemComponent } from './orders/order-item/order-item.component';
import { OfferItemComponent } from './offer/offer-item/offer-item.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SignUpComponent,
    LogInComponent,
    FooterComponent,
    HomeComponent,
    OfferComponent,
    SpinnerComponent,
    ShoppingCartComponent,
    orderTotalPipe,
    OrdersComponent,
    OrderItemComponent,
    OfferItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
