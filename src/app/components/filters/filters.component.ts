import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    if (this._filterData) {
      Object.keys(this._filterData).forEach((key) => {
        const control = {
          [key]:
            this._filterData && this._filterData[key]
              ? this._filterData[key].value
              : [],
        };

        this.filtersCtrl.push(this.fb.group(control));
      });
    }
  }

  get filtersCtrl(): FormArray {
    return this.filterForm.get('filters') as FormArray;
  }
}
