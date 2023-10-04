import { FormControl } from '@angular/forms';

export interface signupFormInterface {
  first_name: FormControl<string | ''>;
  last_name: FormControl<string | null>;
  company_name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  phone_number: FormControl<number | null>;
}

export interface signupAPIInterface {
  firstName: string;
  lastName: string;
  companyName: string;
  email: string;
  password: string;
  mobile: string;
}
export interface registerAPIResponse {
  success?: string;
  token?: string;
}
export interface signupOTPFormInterface {
  otp: FormControl<number | undefined>;
}
