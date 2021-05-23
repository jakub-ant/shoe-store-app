import {
  Component,
  OnDestroy,
} from '@angular/core';
import {
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
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnDestroy {
  isLoading: boolean = false;
  errMessage!: string | null;
  logInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })
  private loginSub!: Subscription;
  get email() {
    return this.logInForm.get('email');
  }
  get password() {
    return this.logInForm.get('password');
  }
  get emailValue() {
    return this.logInForm.get('email') ?.value;
  }
  get passwordValue() {
    return this.logInForm.get('password') ?.value;
  }

  constructor(private readonly authServiceService: AuthServiceService, private readonly router: Router, private readonly apiService: APIService) {}

  onSubmit() {
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
  ngOnDestroy() {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }
}
