import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';
import { PasswordPattern } from '../auth.model';
import { SubSink } from 'subsink';
import { ActivatedRoute } from '@angular/router';

interface IUserForm {
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

interface IResetQP {
  email: string;
  hashcode: string;
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  verificationFailed = false;
  userForm: FormGroup<IUserForm>;
  resetQP: IResetQP | null = null;
  resetSuccess = false;

  constructor(
    private toastr: ToastrService,
    private http: HttpService,
    private route: ActivatedRoute,
  ) {
    this.userForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PasswordPattern),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.subs.sink = this.ctrlByName('confirmPassword').valueChanges.subscribe(
      () => {
        this.setErrOnPasswordMismatch();
      },
    );

    this.route.queryParams.subscribe((qp) => {
      if (Object.keys(qp).length) {
        this.resetQP = {
          email: qp['email'],
          hashcode: qp['hashcode'],
        };

        // hit API
        this.verifyUser();
      } else {
        this.toastr.error('This is not a valid page.', 'Error');
        this.userForm.disable();
        // redirect to login page
      }
    });
  }

  verifyUser() {
    const endpoint = '/authservice/webapi/login/verifyforgotpasswordhashcode';
    const params = this.resetQP || {};
    this.subs.sink = this.http
      .requestToEndpoint<boolean>(endpoint, params)
      .subscribe({
        next: (resp) => {
          if (!resp) {
            this.verificationFailed = true;
          }
        },
        error: (err) => {
          console.error(err);
          this.verificationFailed = true;
          this.toastr.error(
            err.errorMessage || 'Failed to reset password',
            'Error',
          );
        },
      });
  }

  resendLink() {
    const endpoint = '/authservice/webapi/login/resendforgotpassword';
    const params = {
      email: this.resetQP?.email,
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
          this.verificationFailed = true;
          this.toastr.error(
            err.errorMessage || 'Failed to reset password',
            'Error',
          );
        },
      });
  }

  ctrlByName(ctrlName: string): AbstractControl {
    return this.userForm.get(ctrlName) as AbstractControl;
  }

  setErrOnPasswordMismatch() {
    const confirmPassword = this.ctrlByName('confirmPassword');
    const password = this.ctrlByName('password');

    if (confirmPassword.value !== password.value) {
      confirmPassword.setErrors({ mismatch: true });
    }
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.toastr.error('Please enter the required fields', 'Error');
      return;
    }

    const baseUrl = window.location.origin + '/api/auth';
    const endpoint = '/authservice/webapi/login/resetpwd';
    const url = baseUrl + endpoint;
    const body = {
      email: this.resetQP?.email,
      hashcode: this.resetQP?.hashcode,
      newpassword: this.userForm.value.password,
    };
    this.subs.sink = this.http.putToUrl<boolean>(url, body).subscribe({
      next: () => {
        this.resetSuccess = true;
      },
      error: (err) => {
        console.error(err);
        this.resetSuccess = false;
        this.toastr.error('Failed to reset password', 'Error');
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
