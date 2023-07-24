import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
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

function notMatched(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const { password, confirmPassword } = control.value;
    const matched = password && confirmPassword && password !== confirmPassword;
    return matched ? { notMatched: true } : null;
  };
}

const PasswordPattern = new RegExp(
  '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,14}$',
);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  private subs = new SubSink();
  userForm: FormGroup<IUserForm>;

  constructor(
    private toastr: ToastrService,
    private http: HttpService,
  ) {
    this.userForm = new FormGroup({
      company: new FormControl('', [Validators.required]),
      domain: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required]),
      fname: new FormControl('', [Validators.required]),
      lname: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(PasswordPattern),
      ]),
      confirmPassword: new FormControl('', [Validators.required, notMatched]),
      iAgree: new FormControl(false, [Validators.required]),
      oms: new FormControl(false),
      fms: new FormControl(false),
    });
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

  async registerCompanyDetails() {
    console.log(this.userForm);

    if (this.userForm.invalid) {
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

    const companyExist = await firstValueFrom(
      this.checkCompanyExist(value.company || ''),
    );

    if (companyExist) {
      this.toastr.error('Company already exists', 'Error');
      return;
    }

    const emailExist = await firstValueFrom(
      this.checkEmailExist(value.email || ''),
    );

    if (emailExist) {
      this.toastr.error('Email is already registered', 'Error');
      return;
    }

    const phoneExist = await firstValueFrom(
      this.checkPhoneExist(value.phone || ''),
    );

    if (phoneExist) {
      this.toastr.error('Phone number already exists', 'Error');
      return;
    }

    const endpoint = '/authservice/webapi/signup/register';
    this.subs.sink = this.http.postToEndpint(endpoint, postData).subscribe({
      next: (resp) => {
        // Todo: show success ui
        console.log(
          '🚀 ~ this.subs.sink=this.http.requestToEndpoint ~ resp:',
          resp,
        );
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
