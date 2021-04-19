import {
  Component,
  OnDestroy
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  Router
} from '@angular/router';
import {
  Subscription
} from 'rxjs';
import {
  AuthServiceService
} from '../shared/services/auth-service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnDestroy {
  isLoading = false;
  errMessage!: string | null;
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })
  private _signupSub!: Subscription;
  get email(): AbstractControl | null {
    return this.signUpForm.get('email');
  }
  get password(): AbstractControl | null {
    return this.signUpForm.get('password');
  }
  get emailValue(): string {
    return this.email ?.value;
  }
  get passwordValue(): string {
    return this.password ?.value;
  }

  constructor(private readonly autService: AuthServiceService, private readonly router: Router) {}

  onSubmit() {
    this.isLoading = true;
    this._signupSub = this.autService.signUp(this.emailValue, this.passwordValue)
      .subscribe(
        () => {
          this.isLoading = false;
          this.router.navigate(['/log-in'])
        },
        err => {
          this.errMessage = err.error.error.message;
          this.signUpForm.reset();
          this.isLoading = false;
        }
      )
  }
  ngOnDestroy() {
    if (this._signupSub) {
      this._signupSub.unsubscribe();
    }
  }
}
