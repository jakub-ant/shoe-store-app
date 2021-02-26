import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from '../shared/services/auth-service.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  loggedInUser:any
  authSubscription!:Subscription

  constructor(private authService: AuthServiceService) { }

  ngOnInit(): void {
   this.authSubscription= this.authService.loggedInUser.subscribe(user=>this.loggedInUser=user)
  }
ngOnDestroy(){
 if(this.authSubscription)  this.authSubscription.unsubscribe()
}
}
