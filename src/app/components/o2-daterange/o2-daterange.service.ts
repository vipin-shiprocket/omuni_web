import { Injectable } from '@angular/core';
import { getValidMonths } from './o2-daterange.model';
import { BehaviorSubject } from 'rxjs';
import { IOption } from '../chip-selectbox/chip-selectbox.model';

@Injectable({
  providedIn: 'root',
})
export class O2DaterangeService {
  _availableMonths = new BehaviorSubject<IOption[]>([]);

  computeValidMonths(year?: string) {
    this._availableMonths.next(
      getValidMonths(year).map((month) => {
        return {
          value: month,
          display: month,
        };
      }),
    );
  }
}
