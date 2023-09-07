import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CdkListboxModule } from '@angular/cdk/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgOptimizedImage } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CalendarHeaderComponent } from './calender-header.component';
import dayjs from 'dayjs';
import { O2SelectComponent } from '../o2-select/o2-select.component';

export const O2DaterangeModules = [
  FormsModule,
  ReactiveFormsModule,
  CdkListboxModule,
  OverlayModule,
  MatIconModule,
  NgOptimizedImage,
  MatDatepickerModule,
  MatNativeDateModule,
  CalendarHeaderComponent,
  O2SelectComponent,
];

export enum DateOptions {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7DAYS = 'last_7days',
  LAST_30DAYS = 'last_30days',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  LAST_3MONTHS = 'last_3months',
  CUSTOM_RANGE = 'custom_range',
}

export interface IDATE_RANGE {
  label: string;
  key: DateOptions;
  range: dayjs.Dayjs[];
}

export const DATE_RANGE: Record<DateOptions, IDATE_RANGE> = {
  [DateOptions.TODAY]: {
    label: 'Today',
    key: DateOptions.TODAY,
    range: getStartAndEndDate(DateOptions.TODAY),
  },
  [DateOptions.YESTERDAY]: {
    label: 'Yesterday',
    key: DateOptions.YESTERDAY,
    range: getStartAndEndDate(DateOptions.YESTERDAY),
  },
  [DateOptions.LAST_7DAYS]: {
    label: 'Last 7 Days',
    key: DateOptions.LAST_7DAYS,
    range: getStartAndEndDate(DateOptions.LAST_7DAYS),
  },
  [DateOptions.LAST_30DAYS]: {
    label: 'Last 30 Days',
    key: DateOptions.LAST_30DAYS,
    range: getStartAndEndDate(DateOptions.LAST_30DAYS),
  },
  [DateOptions.THIS_MONTH]: {
    label: 'This Month',
    key: DateOptions.THIS_MONTH,
    range: getStartAndEndDate(DateOptions.THIS_MONTH),
  },
  [DateOptions.LAST_MONTH]: {
    label: 'Last Month',
    key: DateOptions.LAST_MONTH,
    range: getStartAndEndDate(DateOptions.LAST_MONTH),
  },
  [DateOptions.LAST_3MONTHS]: {
    label: 'Last 3 Month',
    key: DateOptions.LAST_3MONTHS,
    range: getStartAndEndDate(DateOptions.LAST_3MONTHS),
  },
  [DateOptions.CUSTOM_RANGE]: {
    label: 'Custom Range',
    key: DateOptions.CUSTOM_RANGE,
    range: [],
  },
};

export function getStartAndEndDate(dateRange: DateOptions) {
  switch (dateRange) {
    case DateOptions.TODAY:
      return [dayjs(), dayjs()];

    case DateOptions.YESTERDAY:
      return [dayjs().subtract(1, 'day'), dayjs().subtract(1, 'day')];

    case DateOptions.LAST_7DAYS:
      return [dayjs().subtract(7, 'day'), dayjs()];

    case DateOptions.LAST_30DAYS:
      return [dayjs().subtract(30, 'day'), dayjs()];

    case DateOptions.THIS_MONTH:
      return [dayjs().startOf('month'), dayjs().endOf('month')];

    case DateOptions.LAST_MONTH:
      return [
        dayjs().subtract(1, 'month').startOf('month'),
        dayjs().subtract(1, 'month').endOf('month'),
      ];

    case DateOptions.LAST_3MONTHS:
      return [
        dayjs().subtract(3, 'month').startOf('month'),
        dayjs().subtract(1, 'month').endOf('month'),
      ];

    default:
      throw new Error('Invalid date range');
  }
}

export function getValidMonths(year?: string): string[] {
  if (year) {
    const currentYear = dayjs(year).year();
    const months = [];

    for (let month = 1; month <= 12; month++) {
      months.push(
        dayjs(dayjs(`${currentYear}-${month}`, 'YYYY-MM')).format('MMMM YYYY'),
      );
    }
    return months;
  } else {
    const today = dayjs();
    const lastYear = today.subtract(1, 'year');

    const lastOneYearMonths = [];

    for (let month = lastYear; month <= today; month = month.add(1, 'month')) {
      lastOneYearMonths.push(month.format('MMMM YYYY'));
    }
    return lastOneYearMonths;
  }
}

export function getLastFiveYear(): string[] {
  const today = dayjs();
  const lastFiveYear = today.subtract(5, 'year');

  const lastFiveYears = [];

  for (
    let year = today;
    year >= lastFiveYear;
    year = year.subtract(1, 'year')
  ) {
    lastFiveYears.push(year.format('YYYY'));
  }

  return lastFiveYears;
}

export function isDateGreaterThanToday(date: string | Date) {
  const today = dayjs();
  const enteredDate = dayjs(date);

  return enteredDate > today;
}
