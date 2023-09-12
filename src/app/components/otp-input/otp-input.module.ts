import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtpInputComponent } from './otp-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [OtpInputComponent],
  exports: [OtpInputComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class OtpInputModule {}
