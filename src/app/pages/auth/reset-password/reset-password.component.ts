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

interface IUserForm {
  password: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
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
  constructor(
    private toastr: ToastrService,
    private http: HttpService,
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
    console.log('on submit clicked');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
