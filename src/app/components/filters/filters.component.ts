import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersModules } from './filters.model';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { FilterDataType } from '../index-filters/index-filters.model';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FiltersModules],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent {
  @Input() set filtersData(value: FilterDataType | null) {
    console.log('🚀 ~ @Input ~ value:', value);
    if (value) {
      this._filterData = value;
    }
  }
  _filterData: FilterDataType | undefined;
  filterForm: FormGroup;
  objectvalues = Object.values;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      filters: this.fb.array([]),
    });
  }
}
