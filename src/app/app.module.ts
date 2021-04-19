import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogInComponent } from './log-in/log-in.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { OfferComponent } from './offer/offer.component';
import { SpinnerComponent } from './shared/ui/spinner/spinner.component';
import { HttpClientModule } from '@angular/common/http';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { OrdersComponent } from './orders/orders.component';
 import { OrderItemComponent } from './orders/order-item/order-item.component';
import { OfferItemComponent } from './offer/offer-item/offer-item.component';
// import { HeaderModule } from './header/header.module';
import { HomeModule } from './home/home.module';
import { LogInModule } from './log-in/log-in.module';
import { OfferModule } from './offer/offer.module';
import { SignUpModule } from './sign-up/sign-up.module';
import { OrderModule } from './orders/order.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HomeModule,
    LogInModule,
    SignUpModule,
    OfferModule,
    OrderModule,
    ShoppingCartModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
