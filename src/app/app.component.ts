import { Component, OnInit } from '@angular/core';
import { APIService } from './shared/services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'shoe-store-app';

  constructor(private readonly apiService:APIService){}

  ngOnInit(){
    this.apiService.autoLogin()
  }
}
