import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  logInForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    }
  )
  get email(){
    return this.logInForm.get('email')
  }
  get password() {
    return this.logInForm.get('password')
  }

  constructor() { }

  ngOnInit(): void {

  }

  onSubmit(){
    console.log(this.logInForm)
  }
}
