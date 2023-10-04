import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FooterComponent } from './footer/footer.component';
import { OtpInputComponent } from 'src/app/components/otp-input/otp-input.component';

export const authModule1 = [
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
];

export interface IVerifyEmailResp {
  idtableUserId: number;
  isSelf: null | boolean;
  sessionid: null | string;
  tableClient: null | IFindUser;
  tableFullName: string;
  tableUserContext: number;
  tableUserEmailId: string;
  tableUserFirstName: string;
  tableUserIsDeleted: 0 | 1;
  tableUserIsEmailVerified: boolean;
  tableUserIsFirstTime: boolean;
  tableUserLastName: string;
  tableUserOTP: null | number;
  tableUserPassword: null | string;
  tableUserPhoneNo: string;
  tableUserStatusType: {
    idtableUserStatusTypeId: number;
    tableUserStatusTypeString: 'Active'; // Todo: add other types
  };
  tableUserUserId: string;
  userRole: IRole;
}

export type AuthenticateResp = Partial<IVerifyEmailResp>;

export type IRole = 'ROLE_API' | 'ADMIN'; // Todo: add other types

export interface IFindUser {
  idtableClientId: number;
  tableClientCompanyName: string;
  tableClientCreatedOn: string;
  tableClientDomain: string;
  tableClientDomainAlias: null | string;
  tableClientIsFirstTime: boolean;
  tableClientOnboarding: boolean;
  tableClientStatusType: {
    idtableClientStatusTypeId: number;
    tableClientStatusTypeString: 'Active'; // Todo: add other types
  };
  idtableClientStatusTypeId: number;
  tableClientStatusTypeString: 'Active'; // Todo: add other types
  tableClientSystemNo: string;
  tableClientTimeZone: string;
}

export type TFindUserResp = IFindUser[];
export interface IErrorResp {
  status: number;
  errorMessage?: string;
}

export const PasswordPattern = new RegExp(
  '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{6}$',
);

export const Endpoints = {
  LOGIN_VIA_EMAIL: 'auth/login',
  FORGET_PASSWORD: 'auth/forgot/password',
  USER_RESET_OTP_CONFIRMATION: 'users/reset/otp/confirm',
  USER_PASSWORD_RESET: 'users/password/reset',
  AUTH_MOBILE: 'auth/validate/mobile',
};
