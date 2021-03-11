import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from './shared/services/auth-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'shoe-store-app';

  constructor(private authService:AuthServiceService){}

  ngOnInit(){
    this.authService.getDataFromLocalStorage()
  }
}
