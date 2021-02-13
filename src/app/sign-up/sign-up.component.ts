import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../shared/services/auth-service.service';
 
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
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
    this.autService.signUp(this.emailValue, this.passwordValue)
    .subscribe(
      ()=> this.router.navigate(['/log-in']),
      err=>console.log(err)
    )
  }

}
