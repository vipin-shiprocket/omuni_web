import { FormControl } from '@angular/forms';

export interface signupFormInterface {
  first_name: FormControl<string | ''>;
  last_name: FormControl<string | null>;
  company_name: FormControl<string | null>;
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  phone_number: FormControl<number | null>;
}
