import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OnlyNumbersDirective } from 'src/app/utils/only-numbers.directive';
import { BACKSPACE } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [CommonModule, FormsModule, OnlyNumbersDirective],
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.scss'],
})
export class OtpInputComponent {
  @Output() isvalid = new EventEmitter<boolean>(false);
  @Output() values = new EventEmitter<number>();
  @Input() panelClass = '';
  otp1 = '';
  otp2 = '';
  otp3 = '';
  otp4 = '';
  otp5 = '';
  otp6 = '';

  onInputChange(event: KeyboardEvent) {
    if (event.keyCode !== 8 && isNaN(+event.key)) {
      return;
    }

    // If the user enters more than one digit in a field,
    // clear the remaining fields.
    if (this.otp1.length > 1) {
      this.otp1 = this.otp1.slice(0, 1);
    }
    if (this.otp2.length > 1) {
      this.otp2 = this.otp2.slice(0, 1);
    }
    if (this.otp3.length > 1) {
      this.otp3 = this.otp3.slice(0, 1);
    }
    if (this.otp4.length > 1) {
      this.otp4 = this.otp4.slice(0, 1);
    }
    if (this.otp5.length > 1) {
      this.otp5 = this.otp5.slice(0, 1);
    }
    if (this.otp6.length > 1) {
      this.otp6 = this.otp6.slice(0, 1);
      return;
    }

    if (event.keyCode === BACKSPACE) {
      // Focus on the previous field if the user presses the delete button.
      if (this.otp1.length === 0) {
        return;
      }

      const previousInputFieldElement = (event.target as HTMLInputElement)
        .previousElementSibling;

      (previousInputFieldElement as HTMLInputElement)?.focus();
    } else {
      const nextInputFieldElement = (event.target as HTMLInputElement)
        .nextElementSibling;

      (nextInputFieldElement as HTMLInputElement)?.focus();
    }

    const value =
      this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6;
    this.values.emit(+value);
    this.isvalid.emit(value.length === 6);
  }
}
