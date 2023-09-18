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
  @Input() saveNApply: string | undefined = undefined;
  @Input() set filtersData(value: FilterDataType | null) {
    if (value) {
      this._filterData = value;
    }
  }
  _filterData: FilterDataType | undefined;
  filterForm: FormGroup;
  objectvalues = Object.values;
  showMoreFiltersButton = true;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      filters: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    if (this._filterData) {
      const filterData = this._filterData;
      let placementInCount = 0;
      Object.keys(this._filterData).forEach((key) => {
        const control = new FormGroup({
          [key]: new FormControl(filterData[key].value),
        });

        placementInCount += filterData[key].placement === 'out' ? 0 : 1;

        this.filtersCtrl.push(control);
      });

      this.showMoreFiltersButton = placementInCount > 0;
    }
  }

  length(value: unknown): number {
    if (['number', 'boolean'].includes(typeof value)) return 1;
    if (typeof value === 'string') return value.length;
    return Object.keys(value as never).length;
  }

  checkIfValidType(filterValue: unknown) {
    if (Array.isArray(filterValue)) {
      return filterValue as (string | number | boolean)[];
    }
    return [];
  }

  getDisplayValue(filterKey: string, filterValue: unknown) {
    if (this._filterData) {
      return this._filterData[filterKey].data.find(
        (val) => val.value === filterValue,
      )?.display;
    }
    return '';
  }

  remove(item: unknown) {
    console.log(item);
  }

  get filtersCtrl(): FormArray {
    return this.filterForm.get('filters') as FormArray;
  }
}
