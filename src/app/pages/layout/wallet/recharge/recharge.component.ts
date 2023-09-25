import { Component, Inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RechargeDialogData } from '../wallet.model';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import enIN from '@angular/common/locales/en-IN';
import { MatIconModule } from '@angular/material/icon';

registerLocaleData(enIN);

@Component({
  selector: 'app-recharge',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.scss'],
})
export class RechargeComponent {
  codeType = 1;
  couponValue = 0;
  presetAmounts = [500, 1000, 2500, 5000, 10000];

  rechargeForm = new FormGroup({
    amount: new FormControl(500, [
      Validators.required,
      (control: AbstractControl) => {
        if (control.value % 100 !== 0) {
          return { invalidAmount: true };
        }
        return null;
      },
      Validators.min(500),
      Validators.max(5000000),
    ]),
    couponCode: new FormControl(''),
  });

  constructor(
    public dialogRef: MatDialogRef<RechargeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RechargeDialogData,
  ) {}

  getControl(name: string) {
    return this.rechargeForm.get(name);
  }

  getErrors() {
    const errors = this.getControl('amount')?.errors;

    const messages = [];
    if (errors) {
      const keys = Object.keys(errors);
      if (keys.includes('required')) messages.push('Please enter an amount');
      if (keys.includes('min')) messages.push('Minimum value is 500');
      if (keys.includes('max')) messages.push('Maximum value is 5000000');
      if (keys.includes('invalidAmount'))
        messages.push('Please enter in multiples of 100');
    }
    return messages;
  }

  totalAmount(amount: number | null, couponValue: number): number {
    if (amount == null) {
      return 0;
    } else {
      if (this.codeType) {
        return amount - couponValue;
      } else {
        return amount;
      }
    }
  }
}
