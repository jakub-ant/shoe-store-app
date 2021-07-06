import {
  Component,
  OnDestroy,
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
import {
  APIService
} from '../shared/services/api.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styles: ['.container {max-width: 600px}']
})
export class LogInComponent implements OnDestroy {
  isLoading = false;
  errMessage!: string | null;
  logInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })
  private loginSub!: Subscription;
  get email():AbstractControl|null {
    return this.logInForm.get('email');
  }
  get password():AbstractControl|null {
    return this.logInForm.get('password');
  }
  get emailValue():string {
    return this.logInForm.get('email') ?.value;
  }
  get passwordValue():string {
    return this.logInForm.get('password') ?.value;
  }

  constructor(private readonly authServiceService: AuthServiceService, private readonly router: Router, private readonly apiService: APIService) {}

  onSubmit():void {
    this.isLoading = true;
    this.loginSub = this.authServiceService.signIn(this.emailValue, this.passwordValue)
      .subscribe(user => {
          this.isLoading = false
          this.router.navigate(['/offer']);
          this.apiService.getCurrentCart(user.localId, user.idToken).subscribe();
          this.isLoading = false;
        },
        err => {
          this.errMessage = err.error.error.message;
          this.logInForm.reset();
          this.isLoading = false;
        })
  }
  ngOnDestroy():void {
    this.loginSub ? this.loginSub.unsubscribe():null;
  }
}
