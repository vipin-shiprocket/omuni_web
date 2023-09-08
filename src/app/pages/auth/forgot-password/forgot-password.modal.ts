import { FormControl } from '@angular/forms';

export interface ForgotPasswordInterface {
  emailOrPhoneNumber: FormControl<string | null>;
}

export interface ForgotPasswordOTPInterface {
  otp: FormControl<string | null>;
  // email: string | null;
  // phoneNumber: number | null;
}

export interface resetPasswordInterface {
  newPassword: FormControl<string | null>;
  confirmPassword: FormControl<string | null>;
}

export interface resetPasswordAPIInterface {
  password: string;
  password_confirm: string;
  data: string;
  is_web: number;
  otp: number;
}
