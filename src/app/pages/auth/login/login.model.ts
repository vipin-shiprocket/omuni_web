import { FormControl } from '@angular/forms';

interface IUserForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}
interface IPhoneForm {
  mobile: FormControl<number | string>;
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

export {
  IUserForm,
  IPhoneForm,
  LoginErrorResponse,
  LoginMobileAPIResponse,
  LoginEmailAPIResponse,
};
