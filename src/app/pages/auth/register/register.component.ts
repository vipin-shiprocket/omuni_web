import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';

interface IUserForm {
  company: FormControl<string | null>;
  domain: FormControl<string | null>;
  email: FormControl<string | null>;
  phone: FormControl<string | null>;
  fname: FormControl<string | null>;
  lname: FormControl<string | null>;
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
  iAgree: FormControl<boolean | null>;
  oms: FormControl<boolean | null>;
  fms: FormControl<boolean | null>;
}

const PasswordPattern = new RegExp(
  '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,14}$',
);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  userForm: FormGroup<IUserForm>;
  showRegisterForm = true;

  constructor(
    private toastr: ToastrService,
    private http: HttpService,
  ) {
    this.userForm = new FormGroup({
      company: new FormControl('', [Validators.required]),
      domain: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.minLength(10),
      ]),
      fname: new FormControl('', [Validators.required]),
      lname: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PasswordPattern),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      iAgree: new FormControl(false, [Validators.requiredTrue]),
      oms: new FormControl(false),
      fms: new FormControl(false),
    });
  }

  ngOnInit(): void {
    this.subs.sink = this.ctrlByName('confirmPassword').valueChanges.subscribe(
      () => {
        this.setErrOnPasswordMismatch();
      },
    );
  }

  ctrlByName(ctrlName: string): AbstractControl {
    return this.userForm.get(ctrlName) as AbstractControl;
  }

  checkCompanyExist(company: string) {
    const params = {
      company,
    };
    const endpoint = '/authservice/webapi/signup/checkcompany';
    return this.http.requestToEndpoint<boolean>(endpoint, params);
  }

  checkPhoneExist(phone: string) {
    const params = {
      phone,
    };
    const endpoint = '/authservice/webapi/signup/checkphone';
    return this.http.requestToEndpoint<boolean>(endpoint, params);
  }

  checkEmailExist(email: string) {
    const params = {
      email,
    };
    const endpoint = '/authservice/webapi/signup/checkemail';
    return this.http.requestToEndpoint<boolean>(endpoint, params);
  }

  markAllAsDirty() {
    const controls = this.userForm.controls;
    Object.values(controls).forEach((ctrl: FormControl) => ctrl.markAsDirty());
  }

  setErrOnPasswordMismatch() {
    const confirmPassword = this.ctrlByName('confirmPassword');
    const password = this.ctrlByName('password');

    if (confirmPassword.value !== password.value) {
      confirmPassword.setErrors({ mismatch: true });
    }
  }

  async registerCompanyDetails() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.markAllAsDirty();
      this.toastr.error('Please fill all the mandatory fields', 'Error');
      return;
    }

    const { value } = this.userForm;
    const postData: Record<string, unknown> = {
      fname: value.fname,
      lname: value.lname,
      email: value.email,
      password: value.password,
      phone: value.phone,
      // timezone: value.timezone,
      company: value.company,
      domain: value.domain,
    };

    if (value.oms || value.fms) {
      const apps = [];
      value.oms ? apps.push('OMS') : null;
      value.fms ? apps.push('FMS') : null;

      postData['app'] = apps.join(',');
    }

    const endpoint = '/authservice/webapi/signup/register';

    this.subs.sink = this.checkCompanyExist(value.company || '')
      .pipe(
        switchMap((resp) => {
          if (resp) {
            throw new Error('Company already exists');
          }

          return this.checkEmailExist(value.email || '');
        }),
        switchMap((resp) => {
          if (resp) {
            throw new Error('Email is already registered');
          }

          return this.checkPhoneExist(value.phone || '');
        }),
        switchMap((resp) => {
          if (resp) {
            throw new Error('Phone number already exists');
          }

          return this.http.postToEndpint(endpoint, postData);
        }),
      )
      .subscribe({
        next: () => {
          this.showRegisterForm = false;
        },
        error: (err) => {
          console.error(err);
          const msg = err?.error?.errorMessage;
          this.toastr.error(msg || err.message, 'Error');
        },
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
