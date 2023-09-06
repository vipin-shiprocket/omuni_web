import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
} from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { O2SelectComponent } from '../o2-select/o2-select.component';
import { getLastOneYearMonths } from './o2-daterange.model';
import { IOption } from '../chip-selectbox/chip-selectbox.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import dayjs from 'dayjs';

/** Custom header component for datepicker. */
@Component({
  selector: 'app-calendar-header',
  standalone: true,
  styles: [
    `
      .calendar-header {
        display: flex;
        align-items: center;
        padding: 0.5em;
      }

      .calendar-header-label {
        flex: 1;
        height: 1em;
        font-weight: 500;
        text-align: center;
      }
    `,
  ],
  template: `
    <form>
      <div class="calendar-header">
        <app-o2-select
          class="w-75"
          className="border-0 shadow-none"
          [options]="availableMonths"
          [formControl]="selectedMonth"
        />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatIconModule, O2SelectComponent],
})
export class CalendarHeaderComponent implements OnDestroy {
  private _destroyed = new Subject<void>();
  availableMonths: IOption[] = [];
  selectedMonth: FormControl<IOption[] | null> = new FormControl(null);

  constructor(
    private _calendar: MatCalendar<typeof DateAdapter>,
    private _dateAdapter: DateAdapter<typeof DateAdapter>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    cdr: ChangeDetectorRef,
  ) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());

    this.availableMonths = getLastOneYearMonths().map((month) => {
      return {
        value: month,
        display: month,
      };
    });

    this.selectedMonth.valueChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe((val) => {
        if (val) {
          this.goToMonth(val[0].value as string);
        }
      });

    this.initializeCalendar();
  }

  initializeCalendar() {
    const calMonth = this.calendarMonth;
    const index = this.availableMonths.findIndex((month) => {
      return calMonth === month.value;
    });

    this.selectedMonth.patchValue([this.availableMonths[index]]);
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get calendarMonth(): string {
    return dayjs(this._calendar.activeDate.toString()).format('MMMM YYYY');
  }

  //   get periodLabel() {
  //     return this._dateAdapter.format(
  //       this._calendar.activeDate,
  //       this._dateFormats.display.monthYearA11yLabel,
  //     );
  //   }

  //   previousClicked(mode: 'month' | 'year') {
  //     this._calendar.activeDate =
  //       mode === 'month'
  //         ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
  //         : this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
  //   }

  //   nextClicked(mode: 'month' | 'year') {
  //     this._calendar.activeDate =
  //       mode === 'month'
  //         ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
  //         : this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
  //   }

  goToMonth(month: string) {
    this._calendar.activeDate = this._dateAdapter.addCalendarMonths(
      this._calendar.activeDate,
      dayjs().diff(dayjs(month), 'month'),
    );
  }
}
