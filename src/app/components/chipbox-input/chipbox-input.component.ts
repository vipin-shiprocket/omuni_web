import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ENTER } from '@angular/cdk/keycodes';
import { Observable, map, startWith } from 'rxjs';

@Component({
  selector: 'app-chipbox-input',
  standalone: true,
  imports: [
    CommonModule,
    MatChipsModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  templateUrl: './chipbox-input.component.html',
  styleUrls: ['./chipbox-input.component.scss'],
})
export class ChipboxInputComponent {
  @Output() valueChange = new EventEmitter<string[]>();
  @Input() placeholder = '';
  @Input() searchKeywords: string[] = [];
  @Input() separatorKeysCodes: number[] = [ENTER];
  keywords: string[] = [];
  chipControl = new FormControl<string[]>([]);
  inputControl = new FormControl('');
  filteredKeywords: Observable<string[]>;
  isInputFocused = false;

  constructor() {
    this.filteredKeywords = this.inputControl.valueChanges.pipe(
      startWith(null),
      map((keywrd: string | null) =>
        keywrd ? this._filter(keywrd) : this.searchKeywords.slice(),
      ),
    );
  }

  removeKeyword(keyword: string) {
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords.splice(index, 1);
    }
  }

  addKeyword(event: MatChipInputEvent): void {
    setTimeout(() => {
      const value = event.input.value;

      // Add our keyword
      if (value) {
        this.keywords.push(value);
        this.keywords = [...new Set(this.keywords)];
      }

      // Clear the input value
      event.chipInput.clear();
      this.valueChange.emit(this.keywords);
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const value = this.chipControl?.value ?? [];
    value?.push(event.option.viewValue);
    this.keywords = [...this.keywords, ...value];
    this.keywords = [...new Set(this.keywords)];

    this.inputControl.setValue(null);
    this.valueChange.emit(this.keywords);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.searchKeywords.filter((keyword) =>
      keyword.toLowerCase().includes(filterValue),
    );
  }
}
