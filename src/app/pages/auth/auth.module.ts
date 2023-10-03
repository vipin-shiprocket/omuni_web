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
import { AllowStringDirective } from 'src/app/directives/allowString.directive';
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
    AllowStringDirective,
  ],
  providers: [],
})
export class AuthModule {}
