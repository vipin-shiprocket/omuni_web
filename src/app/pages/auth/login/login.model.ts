import { FormControl } from '@angular/forms';

interface IUserForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
interface IPhoneForm {
  mobile: FormControl<number | string>;
}
interface ILoginOTPForm {
  otp: FormControl<string | null>;
}

interface LoginErrorResponse {
  message: string;
  status_code: number | null;
}
interface LoginMobileAPIResponse {
  success: string;
}
interface LoginEmailAPIResponse {
  success?: string;
  token?: string;
}

interface LoginOTPDTO {
  mobile: string | number;
  otp: number | null;
}

export {
  IUserForm,
  IPhoneForm,
  LoginErrorResponse,
  LoginMobileAPIResponse,
  LoginEmailAPIResponse,
  ILoginOTPForm,
  LoginOTPDTO,
};
