import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ChipSelectBoxModules,
  IOption,
  chipSelectboxType,
} from './chip-selectbox.model';
import { ListboxValueChangeEvent } from '@angular/cdk/listbox';

@Component({
  selector: 'app-chip-selectbox',
  standalone: true,
  imports: [CommonModule, ChipSelectBoxModules],
  templateUrl: './chip-selectbox.component.html',
  styleUrls: ['./chip-selectbox.component.scss'],
})
export class ChipSelectboxComponent {
  @Output() selectionChange = new EventEmitter();
  @Input() disabled = false;
  @Input() label = '';
  @Input() options: IOption[] = [];
  @Input() type: chipSelectboxType = 'select';
  @Input() multiple = false;
  @Input() set values(value: IOption[] | undefined) {
    if (value) {
      this.selectedValues = value;
    }
  }
  selectedValues: IOption[] = [];

  formatValue(value: IOption[]): string {
    if (!value.length) return '';
    return `: ${value.map((v) => v.display).join(',')}`;
  }

  onSelectionChange(selected: ListboxValueChangeEvent<unknown>) {
    this.selectionChange.emit(selected.value);
  }
}
