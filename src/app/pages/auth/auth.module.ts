import { NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RegisterComponent } from './register/register.component';
import { FooterComponent } from './footer/footer.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { OtpInputComponent } from 'src/app/components/otp-input/otp-input.component';
@NgModule({
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    RouterModule,
    RecaptchaV3Module,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    FooterComponent,
    OtpInputComponent,
  ],
  providers: [],
})
export class AuthModule {
  constructor() {
    setTimeout(() => {
      // Fingerprint2.get(function (components) {
      //   var id = Fingerprint2.x64hash128(
      //     components
      //       .map(function (pair) {
      //         return pair.value;
      //       })
      //       .join(),
      //     31,
      //   );
      //   function getCookie(name) {
      //     var dc = document.cookie;
      //     var prefix = name + '=';
      //     var begin = dc.indexOf('; ' + prefix);
      //     if (begin == -1) {
      //       begin = dc.indexOf(prefix);
      //       if (begin != 0) return null;
      //     } else {
      //       begin += 2;
      //       var end = document.cookie.indexOf(';', begin);
      //       if (end == -1) {
      //         end = dc.length;
      //       }
      //     }
      //     return decodeURI(dc.substring(begin + prefix.length, end));
      //   }
      //   var uid = id;
      //   var d = new Date();
      //   var n = d.getTime();
      //   uid = uid + '' + n;
      //   var cus_device = getCookie('cus_device');
      //   var cus_device2 = getCookie('cus_device2');
      //   if (!cus_device || !cus_device2) {
      //     var date = new Date();
      //     date.setDate(date.getDate() + 365);
      //     document.cookie =
      //       'cus_device' + '=' + id + '; expires=' + date + '; path=/';
      //     document.cookie =
      //       'cus_device2' + '=' + uid + '; expires=' + date + '; path=/';
      //   }
      // });
    }, 2000);
  }
}
