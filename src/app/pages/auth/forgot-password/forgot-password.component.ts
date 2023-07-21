import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';

interface IUserForm {
  email: FormControl<string | null>;
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnDestroy {
  private subs = new SubSink();
  userForm: FormGroup<IUserForm>;

  constructor(
    private toastr: ToastrService,
    private http: HttpService,
  ) {
    this.userForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  ctrlByName(ctrlName: string): AbstractControl {
    return this.userForm.get(ctrlName) as AbstractControl;
  }

  resetPassword() {
    if (this.userForm.invalid) {
      this.toastr.error('Invalid Form');
      return;
    }
    console.log('clicked on submit');

    const endpoint = '/authservice/webapi/signup/checkemail';
    const params = {
      email: this.userForm?.value?.email,
    };

    this.subs.sink = this.http.requestToEndpoint(endpoint, params).subscribe({
      next(resp) {
        console.log(resp);
      },
      error(err) {
        console.error(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
