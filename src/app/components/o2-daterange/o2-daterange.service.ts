import { Injectable } from '@angular/core';
import { getValidMonths } from './o2-daterange.model';
import { BehaviorSubject } from 'rxjs';
import { IOption } from '../chip-selectbox/chip-selectbox.model';

@Injectable({
  providedIn: 'root',
})
export class O2DaterangeService {
  _availableMonths = new BehaviorSubject<IOption[]>([]);
  _availableMonths1 = new BehaviorSubject<IOption[]>([]);
  selectMonth = new BehaviorSubject<string[] | null>(null);

  computeValidMonths(year?: string) {
    const availableMonths = getValidMonths(year).map((month) => {
      return {
        value: month.toLowerCase(),
        display: month,
      };
    });

    this._availableMonths.next(availableMonths);
    this._availableMonths1.next(availableMonths);
  }
}
