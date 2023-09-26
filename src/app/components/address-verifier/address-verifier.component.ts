import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { OnlyNumbersDirective } from 'src/app/utils/only-numbers.directive';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OtpInputComponent } from '../otp-input/otp-input.component';

@Component({
  selector: 'app-address-verifier',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    OnlyNumbersDirective,
    ReactiveFormsModule,
    FormsModule,
    OtpInputComponent,
  ],
  templateUrl: './address-verifier.component.html',
  styleUrls: ['./address-verifier.component.scss'],
})
export class AddressVerifierComponent {
  control = new FormControl();
  showOtpInput = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Record<string, unknown>,
    public dialogRef: MatDialogRef<AddressVerifierComponent>,
  ) {
    this.control.setValue(data['phone']);
  }

  sendOTP() {
    const { value } = this.control;
    console.log('🚀 ~ sendOTP ~ value:', value);
    this.showOtpInput = true;
  }

  verifyThroughIVR() {
    // do somthing
  }

  getOtpInputs(otp: number) {
    if (otp.toString().length !== 6) return;

    console.log('🚀 ~ getOtpInputs ~ otp:', otp);
  }
}
