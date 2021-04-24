import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 import { AuthGuard } from './shared/authGuard/auth.guard';
 

const routes: Routes = [{
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[AuthGuard]
})
export class AppRoutingModule { }
