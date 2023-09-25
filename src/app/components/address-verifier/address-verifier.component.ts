import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { OnlyNumbersDirective } from 'src/app/utils/only-numbers.directive';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-address-verifier',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    OnlyNumbersDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './address-verifier.component.html',
  styleUrls: ['./address-verifier.component.scss'],
})
export class AddressVerifierComponent {
  control = new FormControl();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Record<string, unknown>,
    public dialogRef: MatDialogRef<AddressVerifierComponent>,
  ) {
    this.control.setValue(data['phone']);
  }

  sendOTP() {
    const { value } = this.control;
    console.log('🚀 ~ sendOTP ~ value:', value);
  }

  verifyThroughIVR() {
    // do somthing
  }
}
