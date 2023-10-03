import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { Endpoints, preAuthorizationModules } from '../auth.model';
import { environment } from 'src/environments/environment';
import {
  ForgotPasswordInterface,
  forgotPasswordInterface,
  otpConfirmationInterface,
  resetPasswordAPIInterface,
  resetPasswordInterface,
} from './forgot-password.modal';
import {
  clearOTPForm,
  focusOnFirstDigitInOTP,
  onClearForm,
} from 'src/app/utils/utils';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [preAuthorizationModules],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnDestroy, OnInit {
  private subs = new SubSink();
  forgotPasswordForm: FormGroup<ForgotPasswordInterface>;
  forgotPasswordOTPForm: FormGroup;
  resetPasswordForm: FormGroup<resetPasswordInterface>;
  hideResetForm = false;
  email = '';
  phoneNumber = '';
  timerflag = false;
  countdown = 0;
  interval: number | undefined;
  constructor(
    private toastr: ToastrService,
    private http: HttpService,
    private router: Router,
  ) {
    this.forgotPasswordForm = new FormGroup({
      emailOrPhoneNumber: new FormControl('', [Validators.required]),
    });
    this.forgotPasswordOTPForm = new FormGroup({
      otp: new FormControl('', [Validators.required]),
      // email:'',
      // phoneNumber:''
    });

    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        // Validators.pattern(PasswordPattern),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  // Variable Declarations
  showForgotPasswordForm = true;
  showOTPForm = false;
  showResetPasswordForm = false;

  resetPasswordValidationMessage = {
    newPassword: [
      { type: 'required', message: 'This field is required' },
      {
        type: 'pattern',
        message:
          'Your password must contain at least one uppercase, one lowercase, one number and minimum 8 characters',
      },
    ],
    confirmPassword: [
      { type: 'required', message: 'This field is required' },
      {
        type: 'mismatch',
        message: 'The new password and confirm password must match.',
      },
    ],
  };

  // Methods

  ngOnInit(): void {
    this.subs.sink = this.ctrlByNameForResetPasswordForm(
      'confirmPassword',
    ).valueChanges.subscribe(() => {
      this.setErrOnPasswordMismatch();
    });
  }
  /**
   *  ctrlByNameForForgotPasswordOTPForm
   * @param ctrlName
   * @returns AbstractControl
   */
  ctrlByNameForForgotPasswordOTPForm(ctrlName: string): AbstractControl {
    return this.forgotPasswordOTPForm.get(ctrlName) as AbstractControl;
  }

  /**
   *  ctrlByNameForForgotPasswordForm
   * @param ctrlName
   * @returns AbstractControl
   */
  ctrlByNameForForgotPasswordForm(ctrlName: string): AbstractControl {
    return this.forgotPasswordForm.get(ctrlName) as AbstractControl;
  }
  /**
   *  ctrlByNameForForgotPasswordForm
   * @param ctrlName
   * @returns AbstractControl
   */
  ctrlByNameForResetPasswordForm(ctrlName: string): AbstractControl {
    return this.resetPasswordForm.get(ctrlName) as AbstractControl;
  }
  /**
   * @name setErrOnPasswordMismatch
   * @returns void
   */
  setErrOnPasswordMismatch(): void {
    const confirmPassword =
      this.ctrlByNameForResetPasswordForm('confirmPassword');
    const password = this.ctrlByNameForResetPasswordForm('newPassword');

    if (confirmPassword.value !== password.value) {
      confirmPassword.setErrors({ mismatch: true });
    }
  }

  /**
   * @name backToLogin
   * @param currentScreen
   * @description Redirect to Login Page/Route
   */
  backToLogin(currentScreen: string) {
    if (currentScreen == 'login') {
      this.router.navigate(['/login']);
    }
    if (currentScreen == 'forgotpassword') {
      this.showForgotPasswordForm = true;
      this.showOTPForm = false;
      this.showResetPasswordForm = false;
      onClearForm(this.forgotPasswordOTPForm);
      clearOTPForm();
    }
    // will add new conditions in future
  }

  /**
   * @name goToOTPScreen
   * @description Redirect to OTP Screen
   */
  goToOTPScreen() {
    this.showForgotPasswordForm = false;
    this.showOTPForm = true;
    focusOnFirstDigitInOTP();
  }
  goToResetPasswordScreen() {
    this.showForgotPasswordForm = false;
    this.showOTPForm = false;
    this.showResetPasswordForm = true;
  }

  /**
   * @name onForgotPasswordFormSubmit
   * @description On Click on 'Send OTP' Button it will Triiger an API and If data is correct then redirect to OTP
   */
  onForgotPasswordFormSubmit() {
    const emailOrPhoneNumber =
      this.ctrlByNameForForgotPasswordForm('emailOrPhoneNumber');
    if (emailOrPhoneNumber.errors) {
      return;
    }
    const body: Record<string, string> = { data: emailOrPhoneNumber.value };

    const header = this.http.getHeaders();
    this.subs.sink = this.http
      .postToEndpint<forgotPasswordInterface>(
        environment.API_VERSION_V1 + '/' + Endpoints.FORGET_PASSWORD,
        body,
        {},
        header,
      )
      .subscribe({
        next: (resp) => {
          if (resp && resp.mobile) {
            this.goToOTPScreen();
            this.startCountDown(30);
            this.email = resp.email;
            this.phoneNumber = resp.mobile;
          }
        },
        error: (err) => {
          this.goToOTPScreen();
          this.startCountDown(30);
          emailOrPhoneNumber.setErrors({
            serverError: err.error.message,
          });
        },
      });
  }

  /**
   * @name getOtpState
   * @param isValid
   * @description Gives State on every Key up
   */
  getOtpState(isValid: boolean) {
    if (isValid) {
      this.ctrlByNameForForgotPasswordOTPForm('otp').setErrors(null);
    } else {
      this.ctrlByNameForForgotPasswordOTPForm('otp').setErrors({
        required: true,
      });
    }
  }

  /**
   * @name getOtpInputs
   * @param value
   * @description Gives whole OTP Value on every Key up
   */
  getOtpInputs(value: number) {
    this.ctrlByNameForForgotPasswordOTPForm('otp').setValue(value);
  }

  /**
   * @name Resend OTP
   */
  resendOTP() {
    const emailOrPhoneNumber =
      this.ctrlByNameForForgotPasswordForm('emailOrPhoneNumber').value;

    const body: Record<string, string> = { data: emailOrPhoneNumber };

    const header = this.http.getHeaders();
    this.subs.sink = this.http
      .postToEndpint<unknown>(
        environment.API_VERSION_V1 + '/' + Endpoints.FORGET_PASSWORD,
        body,
        {},
        header,
      )
      .subscribe({
        next: () => {
          //TODO: Need TO verify response of this api

          this.ctrlByNameForForgotPasswordOTPForm('otp').setValue('');
          clearOTPForm();
        },
        error: (err) => {
          this.ctrlByNameForForgotPasswordOTPForm('otp').setErrors({
            serverError: err.error.message,
          });
        },
      });
  }
  /**
   * @name startCountDown
   * @param seconds
   * @description for calling count down
   */
  startCountDown(seconds: number) {
    let counter = seconds;
    this.timerflag = true;
    this.countdown = counter;
    counter--;
    this.interval = window.setInterval(() => {
      this.countdown = counter;
      counter--;
      if (this.countdown <= 0) {
        clearInterval(this.interval);
        this.timerflag = false;
      }
    }, 1000);
  }

  /**
   * @name onEnterOTPFormSubmit
   * @description On form submit
   *
   */
  onOTPFormSubmit(): void {
    console.log('on enter otp');

    const otpForm = this.ctrlByNameForForgotPasswordOTPForm('otp');
    if (otpForm.errors) {
      return;
    }
    const body: Record<string, string | number> = {
      otp: otpForm.value,
      is_web: 1,
      data: this.ctrlByNameForForgotPasswordForm('emailOrPhoneNumber').value,
    };

    const header = this.http.getHeaders();
    this.subs.sink = this.http
      .postToEndpint<otpConfirmationInterface>(
        environment.API_VERSION_V1 +
          '/' +
          Endpoints.USER_RESET_OTP_CONFIRMATION,
        body,
        {},
        header,
      )
      .subscribe({
        next: (resp) => {
          if (resp && resp['success']) {
            // onClearForm(this.forgotPasswordForm);
            // onClearForm(this.forgotPasswordOTPForm);
            clearOTPForm();
            this.goToResetPasswordScreen();
          }
        },
        error: (err) => {
          otpForm.setErrors({
            serverError: err.error.message,
          });

          // onClearForm(this.forgotPasswordForm);
          // onClearForm(this.forgotPasswordOTPForm);
          // clearOTPForm();
          this.goToResetPasswordScreen();
        },
      });
  }

  /**
   *@name onSubmitResetPasswordForm
   *@param value
   *@return void
   *@description on Submit or enter click of reset passwrod
   */
  onSubmitResetPasswordForm(): void {
    this.ctrlByNameForResetPasswordForm('newPassword').valid;
    /**
    https://apiv2.shiprocket.in/v1/users/password/reset
    POST
    {"password":"DixitHasija09#1","password_confirm":"DixitHasija09#1","is_web":1,"otp":565374,"data":"9988303006"}
    */

    const resetPasswordForm = this.resetPasswordForm;
    if (resetPasswordForm.errors) {
      return;
    }
    const body: resetPasswordAPIInterface = {
      password: this.ctrlByNameForResetPasswordForm('newPassword').value,
      password_confirm:
        this.ctrlByNameForResetPasswordForm('confirmPassword').value,
      data: this.ctrlByNameForForgotPasswordForm('emailOrPhoneNumber').value,
      is_web: 1,
      otp: this.ctrlByNameForForgotPasswordOTPForm('otp').value,
    };

    const header = this.http.getHeaders();
    this.subs.sink = this.http
      .postToEndpint<undefined>(
        environment.API_VERSION_V1 + '/' + Endpoints.USER_PASSWORD_RESET,
        body,
        {},
        header,
      )
      .subscribe({
        next: (resp) => {
          if (resp && resp['success']) {
            onClearForm(this.forgotPasswordForm);
            onClearForm(this.forgotPasswordOTPForm);
            // clearOTPForm();
            this.backToLogin('login');
            // this.goToResetPasswordScreen();
          }
        },
        error: (err) => {
          resetPasswordForm.setErrors({
            serverError: err.error.message,
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
