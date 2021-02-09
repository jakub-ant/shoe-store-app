import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LogInComponent } from './log-in/log-in.component';
import { OfferComponent } from './offer/offer.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {path: 'home',
  component: HomeComponent,
},{
  path: 'offer',
  component: OfferComponent
},

  {
    path:'sign-up',
    component: SignUpComponent
  },
  {
    path:'log-in',
    component: LogInComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
