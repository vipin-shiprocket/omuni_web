import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-o2-quantity-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './o2-quantity-input.component.html',
  styleUrls: ['./o2-quantity-input.component.scss'],
})
export class O2QuantityInputComponent {
  @Input({ required: true }) value = 1;
  @Input() min = 0;
  @Input() max = Infinity;
  @Output() output = new EventEmitter<number>();

  add(el: HTMLInputElement, val: number) {
    this.value = Math.min(Math.max(el.valueAsNumber + val, 0), this.max);
    this.output.emit(this.value);
  }
}
