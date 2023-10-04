import { Component, OnDestroy, OnInit } from '@angular/core';
// import {
//   AbstractControl,
//   FormControl,
//   FormGroup,
//   Validators,
// } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
// import { switchMap } from 'rxjs';
import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';
// import { PasswordPattern } from '../auth.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  private subs = new SubSink();

  constructor(
    private toastr: ToastrService,
    private http: HttpService,
  ) {}
  tabactive = 'first';

  ngOnInit(): void {
    console.log('hi');

    //  hi
    // this.subs.sink = this.ctrlByName('confirmPassword').valueChanges.subscribe(
    //   () => {
    //      this.setErrOnPasswordMismatch();
    //   },
    // );
  }
  registerWithGoogle() {
    // registerWithGoogle
  }
  registerWithShopify() {
    // registerWithShopify
  }
  onSignupFormSubmit() {
    // onSignupFormSubmit
  }

  changeclass(selected: string): void {
    // int
    this.tabactive = selected;
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
