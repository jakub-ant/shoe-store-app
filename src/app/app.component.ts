import { Component, OnInit } from '@angular/core';
import { DbServiceService } from './shared/services/db-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'shoe-store-app';

  constructor(private readonly dbService:DbServiceService){}

  ngOnInit(){
    this.dbService.autoLogin()
  }
}
