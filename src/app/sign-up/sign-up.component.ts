import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthServiceService } from '../shared/services/auth-service.service';
 
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  isLoading:boolean=false;
  errMessage!:string|null
  signupSub!:Subscription
  signUpForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    }
  )
  get email(){
    return this.signUpForm.get('email')
  }
  get password() {
    return this.signUpForm.get('password')
  }
  get emailValue(){
    return this.signUpForm.get('email')?.value
  }
  get passwordValue() {
    return this.signUpForm.get('password')?.value
  }

  constructor(private autService: AuthServiceService,private router: Router) { }

  ngOnInit(): void {

  }
 

  onSubmit(){
    this.isLoading=true
    this.signupSub = this.autService.signUp(this.emailValue, this.passwordValue)
    .subscribe(
      ()=> {
        this.isLoading=false
        this.router.navigate(['/log-in'])},
      err=>{
        this.errMessage=err.error.error.message;
        this.signUpForm.reset()
        this.isLoading = false
      }
    )
  }

  ngOnDestroy(){
    if(this.signupSub) this.signupSub.unsubscribe()
  }

}
