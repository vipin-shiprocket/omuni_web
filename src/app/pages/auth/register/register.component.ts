import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
// import { switchMap } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';
// import { signupFormInterface } from './register.modal';
import { focusOnFirstDigitInOTP, toggleEye } from 'src/app/utils/utils';
import {
  Endpoints,
  emailPattern,
  mobilePattern,
  preAuthorizationModules,
} from '../auth.model';
import {
  registerAPIResponse,
  signupAPIInterface,
  signupOTPFormInterface,
} from './register.modal';
// import { environment } from 'src/environments/environment';
// import { PasswordPattern } from '../auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [preAuthorizationModules],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  /**
   * Variables Declarations
   */
  signupForm: FormGroup;
  signupOTPForm: FormGroup;
  tabactive = 'first';
  toggle = toggleEye;
  isTCVerified = false;
  showSignupForm = true;
  timerflag = false;
  invalidOtpError = false;
  interval: number | undefined;

  capSmallFlag = false;
  specialCharFlag = false;
  numericFlag = false;
  specialCharFlags = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
  num = /\d/;
  lowerCaseLetters = /[a-z]/g;
  upperCaseLetters = /[A-Z]/g;

  loginOTP: number | undefined;
  countdown = 0;
  errorOtpMessage = '';

  constructor(
    private toastr: ToastrService,
    private http: HttpService,
  ) {
    this.signupForm = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      company_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(emailPattern),
      ]),
      password: new FormControl('', [
        Validators.required,
        // Validators.pattern(PasswordPattern),
      ]),
      phone_number: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(mobilePattern),
      ]),
    });
    this.signupOTPForm = new FormGroup({
      otp: new FormControl(null, [Validators.required]),
    });
  }

  signupValidationMessage = {
    first_name: [
      { type: 'required', message: 'This field is required' },
      { type: 'apiError', message: '' },
    ],
    last_name: [
      { type: 'required', message: 'This field is required' },
      { type: 'apiError', message: '' },
    ],
    company_name: [
      { type: 'required', message: 'This field is required' },
      { type: 'apiError', message: '' },
    ],
    email: [
      { type: 'required', message: 'This field is required' },
      // { type: 'email', message: 'Please enter a valid email id' },//this is commented because of pattern
      { type: 'pattern', message: 'Please enter a valid email id' },
      { type: 'apiError', message: '' },
    ],
    password: [
      { type: 'required', message: 'This field is required' },
      {
        type: 'minlength',
        message: 'Password must be at least 8 characters long',
      },
      {
        type: 'pattern',
        message: '',
      },
      {
        type: 'apiError',
        message: '',
      },
    ],
    phone_number: [],
  };
  ctrlByName(ctrlName: string): AbstractControl {
    return this.signupForm.get(ctrlName) as AbstractControl;
  }
  ctrlByNameForOTP(ctrlName: string): AbstractControl {
    return this.signupOTPForm.get(ctrlName) as AbstractControl;
  }
  ngOnInit(): void {
    console.log('hi');
  }
  registerWithGoogle() {
    // registerWithGoogle
  }
  registerWithShopify() {
    // registerWithShopify
  }
  onSignupFormSubmit() {
    // onSignupFormSubmit
    this.signupForm;
    // this.showUserOtpVerify = true;
    if (this.signupForm.invalid) {
      return;
    }

    // const { email, password } = this.signupForm.value;
    const data: signupAPIInterface = {
      firstName: this.ctrlByName('first_name').value,
      lastName: this.ctrlByName('last_name').value,
      companyName: this.ctrlByName('company_name').value,
      email: this.ctrlByName('email').value,
      password: this.ctrlByName('password').value,
      mobile: this.ctrlByName('phone_number').value,
    };

    const header = this.http.getHeaders();
    this.startCountDown(30);
    this.subs.sink = this.http
      .postToEndpint<registerAPIResponse>(Endpoints.REGISTER, data, {}, header)
      .subscribe({
        next: (resp) => {
          if (resp) {
            //HI
          }
        },
        error: (err) => {
          console.error(err);
          this.showSignupForm = false;
          focusOnFirstDigitInOTP();
          // Error Handling is Pending need Discussion with @vinay.yr
        },
      });
  }

  getOtpState(isValid: boolean) {
    //

    if (isValid) {
      this.ctrlByNameForOTP('otp').setErrors(null);
    } else {
      this.ctrlByNameForOTP('otp').setErrors({
        required: true,
      });
    }
    isValid;
  }

  /**
   * @name getOtpInputs
   * @param val
   * @description Gives whole OTP Value on every Key up
   */
  getOtpInputs(val: number) {
    this.loginOTP = val;
    this.ctrlByNameForOTP('otp').setValue(val);
  }

  changeclass(selected: string): void {
    // int
    this.tabactive = selected;
  }
  checkPassword() {
    //
    const userInput = this.ctrlByName('password').value;
    if (
      userInput.match(this.lowerCaseLetters) &&
      userInput.match(this.upperCaseLetters)
    ) {
      this.capSmallFlag = true;
    } else {
      this.capSmallFlag = false;
    }
    if (this.num.test(userInput)) {
      this.numericFlag = true;
    } else {
      this.numericFlag = false;
    }
    if (this.specialCharFlags.test(userInput)) {
      this.specialCharFlag = true;
    } else {
      this.specialCharFlag = false;
    }
    if (this.capSmallFlag && this.numericFlag && this.specialCharFlag) {
      this.ctrlByName('password').setErrors(null);
    } else {
      this.ctrlByName('password').setErrors({
        pattern: true,
      });
    }
  }
  backToSignUpForm() {
    this.showSignupForm = true;
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
    // HI;

    this.ctrlByNameForOTP('otp').value;
    const data = {
      otp: this.ctrlByNameForOTP('otp').value,
    };

    const header = this.http.getHeaders();

    this.subs.sink = this.http
      .postToEndpint<registerAPIResponse>(
        Endpoints.OTP_VERIFY,
        data,
        {},
        header,
      )
      .subscribe({
        next: (resp) => {
          if (resp) {
            //HI
          }
        },
        error: (err) => {
          console.error(err);
          this.showSignupForm = false;
          // Error Handling is Pending need Discussion with @vinay.yr
        },
      });
  }

  generateOTP() {
    const endpoint = '/authservice/webapi/login/resendforgotpassword';
    const params = {
      email: this.ctrlByName('email').value,
    };
    this.subs.sink = this.http
      .requestToEndpoint<boolean>(endpoint, params)
      .subscribe({
        next: () => {
          this.toastr.success(
            'Password reset link has been sent again to your registered email',
            'Success',
          );
        },
        error: (err) => {
          console.error(err);

          this.toastr.error(
            err.errorMessage || 'Failed to reset password',
            'Error',
          );
        },
      });
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
