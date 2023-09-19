import { Component, OnDestroy, inject } from '@angular/core';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SubSink } from 'subsink';
import { HttpService } from 'src/app/services/http.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
// import { ReCaptchaV3Service } from 'ng-recaptcha';
import { focusOnFirstDigitInOTP, toggleEye } from 'src/app/utils/utils';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import {
  IUserForm,
  LoginEmailAPIResponse,
  LoginErrorResponse,
  LoginMobileAPIResponse,
  ILoginOTPForm,
  LoginOTPDTO,
} from './login.model';
import { Endpoints, PasswordPattern } from '../auth.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  private subs = new SubSink();
  userForm: FormGroup<IUserForm>;
  phoneLoginForm: FormGroup;
  loginOTPForm: FormGroup<ILoginOTPForm>;
  toggle = toggleEye;
  showEmailLoginForm = true;
  showPhoneLoginForm = false;
  showOtpForm = false;
  submitted = false;
  showSocialMediaTabs = true;

  timerflag = false;
  countdown = 0;
  invalidOtpError = '';
  errorOtpMessage = '';
  errorShow = '';
  isOtpValid = false;
  interval: number | undefined;
  constructor(
    private http: HttpService,
    private toastr: ToastrService,
    private _router: Router,
    private cookie: CookieService,
  ) {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        // Validators.pattern(PasswordPattern),
      ]),
    });
    this.ctrlByName('password').enable();

    this.phoneLoginForm = new FormGroup({
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]),
    });
    this.changeFormSubmitTo(false);
    this.loginOTPForm = new FormGroup({
      otp: new FormControl('', [Validators.required]),
    });
  }

  formResponseErrorObj: LoginErrorResponse = { message: '', status_code: null };
  loginValidationMessage = {
    email: [
      { type: 'required', message: 'This field is required' },
      // { type: 'email', message: 'Please enter a valid email id' },//this is commented because of pattern
      { type: 'pattern', message: 'Please enter a valid email id' },
    ],
    password: [
      { type: 'required', message: 'This field is required' },
      // {
      //   type: 'minlength',
      //   message: 'Password must be at least 8 characters long',
      // },
      // {
      //   type: 'pattern',
      //   message:
      //     'Your password must contain at least one uppercase, one lowercase, one number and minimum 8 characters',
      // },
    ],
  };
  mobileValidationMessage = {
    mobile: [
      { type: 'required', message: 'This field is required' },
      { type: 'pattern', message: 'Please enter a valid Mobile Number' },
    ],
  };
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$';
  mobilePattern = '^[0-9]{10}$';

  ctrlByName(ctrlName: string): AbstractControl {
    return this.userForm.get(ctrlName) as AbstractControl;
  }
  ctrlByNameForMobile(ctrlName: string): AbstractControl {
    return this.phoneLoginForm.get(ctrlName) as AbstractControl;
  }
  ctrlByNameForOTP(ctrlName: string): AbstractControl {
    return this.loginOTPForm.get(ctrlName) as AbstractControl;
  }

  signInWithGoogle() {
    // signInWithGoogle
  }

  onClickLoginViaPhoneNumber() {
    this.showPhoneLoginForm = true;
    this.showEmailLoginForm = false;
    this.resetLoginViaPhoneNumberForm();
  }
  resetLoginViaPhoneNumberForm() {
    this.phoneLoginForm.reset('');

    this.userForm.markAsUntouched();
    this.userForm.markAsPristine();
  }

  changeOtpScreen() {
    this.showOtpForm = !this.showOtpForm;
  }

  onClickEmailId() {
    this.changeFormSubmitTo(false);

    this.showPhoneLoginForm = !this.showPhoneLoginForm;
    this.showEmailLoginForm = !this.showEmailLoginForm;
  }

  generateOTP() {
    this.submitted = true;
    const mobileNumber = this.ctrlByNameForMobile('mobile');
    if (mobileNumber.errors) {
      return;
    }

    const endpoint = environment.API_VERSION_V1 + '/' + 'auth/login/mobile';
    const body: Record<string, number> = { mobile: mobileNumber.value };

    const header = this.http.getHeaders();
    this.subs.sink = this.http
      .postToEndpint<LoginMobileAPIResponse>(endpoint, body, {}, header)
      .subscribe({
        next: (resp) => {
          if (resp.success) {
            this.changeOtpScreen();
            this.showPhoneLoginForm = false;
            this.showEmailLoginForm = false;
            // this.resetLoginViaPhoneNumberForm();

            this.changeSocialMediaTabs();

            this.startCountDown(30);
            //  For focusing First digit Input box
            focusOnFirstDigitInOTP();
          }
        },
        error: (err) => {
          console.error(err.error.message);
          const error = err.error as LoginErrorResponse;
          this.formResponseErrorObj = error;
          //#TODO: Remove below code
          this.changeOtpScreen();
          this.showPhoneLoginForm = false;
          this.showEmailLoginForm = false;
          // this.resetLoginViaPhoneNumberForm();

          this.changeSocialMediaTabs();

          this.startCountDown(30);
          //  For focusing First digit Input box
          focusOnFirstDigitInOTP();
        },
      });
  }

  changeSocialMediaTabs() {
    this.showSocialMediaTabs = !this.showSocialMediaTabs;
  }

  changeFormSubmitTo(bool: boolean) {
    if (bool || !bool) {
      this.submitted = bool;
    }
  }

  markAllAsDirty(data: FormGroup) {
    const controls = data.controls;
    Object.values(controls).forEach((ctrl: AbstractControl) => {
      if (ctrl) {
        ctrl.markAsDirty();
      }
    });
  }

  backToLogin(currentScreen: string) {
    if (currentScreen == 'phoneotp') {
      this.changeOtpScreen();
      // this.onClickLoginViaPhoneNumber();
      this.changeSocialMediaTabs();
      clearInterval(this.interval);
      this.timerflag = false;
      this.showPhoneLoginForm = true;
      this.showEmailLoginForm = false;
    }
    // will add new conditions in future
  }

  /**
   * @name getOtpState
   * @param isValid
   * @description Gives State on every Key up
   */
  getOtpState(isValid: boolean) {
    if (isValid) {
      this.ctrlByNameForOTP('otp').setErrors(null);
    } else {
      this.ctrlByNameForOTP('otp').setErrors({
        required: true,
      });
    }
  }
  /**
   * @name getOtpInputs
   * @param val
   * @description Gives whole OTP Value on every Key up
   */
  getOtpInputs(val: number) {
    this.ctrlByNameForOTP('otp').setValue(val);
  }

  onSubmit() {
    this.changeFormSubmitTo(true);
    this.userForm.markAllAsTouched();
    this.userForm.markAsDirty();
    this.markAllAsDirty(this.userForm);
    // this.showUserOtpVerify = true;
    if (this.userForm.invalid) {
      return;
    }

    const { email, password } = this.userForm.value;
    const data = {
      email: email,
      password: password,
      device_id: uuidv4(),
    };
    // const recaptcha$ = this.recaptchaService.execute('login');
    // const recaptchaToken = await firstValueFrom(recaptcha$);
    // data.token = recaptchaToken;

    const body = data;

    const header = this.http.getHeaders();

    this.subs.sink = this.http
      .postToEndpint<LoginEmailAPIResponse>(
        environment.API_VERSION_V1 + '/' + Endpoints.LOGIN_VIA_EMAIL,
        body,
        {},
        header,
      )
      .subscribe({
        next: (resp) => {
          if (resp.token) {
            localStorage.setItem('token', resp.token);
            this.cookie.set('isLoggedIn', 'true');
            this.toastr.success('', 'Login Successfully!');
            this._router.navigate(['dashboard']);
          }
        },
        error: (err) => {
          console.error(err);
          const error = err.error as LoginErrorResponse;
          this.formResponseErrorObj = error;

          // this.userForm.setErrors({invalid:true})

          // err?.error?.message;
          // this.toastr.error('Error while login in, Please try again', 'Error');
        },
      });
  }

  startCountDown(seconds: number) {
    let counter = seconds;
    this.timerflag = true;
    this.countdown = counter;
    this.interval = window.setInterval(() => {
      this.countdown = counter;
      counter--;
      if (this.countdown <= 0) {
        clearInterval(this.interval);
        this.timerflag = false;
      }
    }, 1000);
  }

  onOTPFormSubmit() {
    if (this.ctrlByNameForOTP('otp').errors) {
      return;
    }

    const body: LoginOTPDTO = {
      otp: null,
      mobile: '',
    };
    body.otp = this.ctrlByNameForOTP('otp').value;
    body.mobile = this.ctrlByNameForMobile('mobile').value;
    // const body = data;

    const header = this.http.getHeaders();

    this.subs.sink = this.http
      .postToEndpint<LoginEmailAPIResponse>(
        environment.API_VERSION_V1 + '/' + Endpoints.AUTH_MOBILE,
        body,
        {},
        header,
      )
      .subscribe({
        next: (resp) => {
          if (resp.token) {
            localStorage.setItem('token', resp.token);
          }
        },
        error: (err) => {
          console.error(err);
          const error = err.error as LoginErrorResponse;
          this.formResponseErrorObj = error;
          this.errorOtpMessage = error.message;
        },
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
