import {
  Component,
  OnDestroy,
  OnInit
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
  DbServiceService
} from '../shared/services/db-service.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  loginSub!: Subscription;
  errMessage!: string | null

  logInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  })
  get email() {
    return this.logInForm.get('email')
  }
  get password() {
    return this.logInForm.get('password')
  }
  get emailValue() {
    return this.logInForm.get('email')?.value
  }
  get passwordValue() {
    return this.logInForm.get('password')?.value
  }

  constructor(private authServiceService: AuthServiceService, private router: Router, private dbService: DbServiceService) {}

  ngOnInit(): void {

  }

  onSubmit() {
    this.isLoading = true
    this.loginSub = this.authServiceService.signIn(this.emailValue, this.passwordValue)
      .subscribe(user => {
          this.isLoading = false
          this.router.navigate(['/offer']);
          this.dbService.getCurrentCart(user.localId, user.idToken).subscribe()
          this.isLoading = false
        },
        err => {
          this.errMessage = err.error.error.message;
          this.logInForm.reset()
          this.isLoading = false
        })
  }
  ngOnDestroy() {
    if (this.loginSub) this.loginSub.unsubscribe()
  }
}
