// import { HtmlTagDefinition } from '@angular/compiler';
import { FormGroup } from '@angular/forms';

export const toggleEye = (el: HTMLInputElement): void => {
  if (el.type === 'password') {
    el.type = 'text';
  } else {
    el.type = 'password';
  }
};

export const focusOnFirstDigitInOTP = (): void => {
  //  For focusing First digit Input box
  setTimeout(() => {
    const a = document.querySelectorAll('#digit-1');

    a.forEach((element) => {
      const nodde = element as HTMLInputElement;
      nodde?.focus();
      return true;
    });
  }, 300);
};

export const clearOTPForm = (): void => {
  for (let i = 1; i < 7; i++) {
    (<HTMLInputElement>document.getElementById('digit-' + i)).value = '';
  }
};

export const onClearForm = (form: FormGroup): void => {
  form.reset('');
  form.markAsUntouched();
  form.markAsPristine();
};
