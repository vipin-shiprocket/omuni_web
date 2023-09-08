import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersModules } from './filters.model';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FilterDataType } from '../index-filters/index-filters.model';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FiltersModules],
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
})
export class FiltersComponent implements OnInit {
  @Input() set filtersData(value: FilterDataType | null) {
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

  ngOnInit(): void {
    if (this._filterData) {
      const filterData = this._filterData;
      Object.keys(this._filterData).forEach((key) => {
        const control = new FormGroup({
          [key]: new FormControl(filterData[key].value),
        });

        this.filtersCtrl.push(control);
      });
    }
  }

  checkIfValidType(filterValue: unknown) {
    if (Array.isArray(filterValue)) {
      return filterValue as (string | number | boolean)[];
    }
    return [];
  }

  get filtersCtrl(): FormArray {
    return this.filterForm.get('filters') as FormArray;
  }
}
