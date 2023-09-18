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

  getData(filterKey: string, filterValue: unknown) {
    if (this._filterData) {
      return this._filterData[filterKey].data.find(
        (val) => val.value === filterValue,
      );
    }
    return null;
  }

  remove(index: number, item: unknown) {
    const val = Object.values(this.filtersCtrl.controls[index].value)[0];
    Array.isArray(val) ? val.splice(val.indexOf(item), 1) : null;
  }

  clearAll() {
    Object.keys(this.filtersCtrl.controls).forEach((index) => {
      const filter = Object.values(
        this.filtersCtrl.controls[index as never].value,
      )[0];
      Array.isArray(filter) ? filter.splice(0, filter.length) : null;
    });
  }

  get showChipsSection() {
    return Object.keys(this.filtersCtrl.controls).some((index) => {
      const filter = Object.values(
        this.filtersCtrl.controls[index as never].value,
      )[0];

      return Array.isArray(filter) ? filter.length > 0 : true;
    });
  }

  get filtersCtrl(): FormArray {
    return this.filterForm.get('filters') as FormArray;
  }
}
