import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
} from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';
import { O2SelectComponent } from '../o2-select/o2-select.component';
import { IOption } from '../chip-selectbox/chip-selectbox.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import toArray from 'dayjs/plugin/toArray';
import { O2DaterangeService } from './o2-daterange.service';
import { sleep } from 'src/app/utils/utils';
dayjs.extend(toArray);

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
    `,
  ],
  template: `
    <form>
      <div class="calendar-header">
        <app-o2-select
          className="border-0 shadow-none"
          [options]="(calService._availableMonths | async) || []"
          [values]="(calService.selectMonth | async) || []"
          (selectionChange)="onChangeMonth($event)"
        />
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatIconModule,
    O2SelectComponent,
    CommonModule,
  ],
  // providers: [MatCalendar],
})
export class CalendarHeaderComponent implements OnDestroy {
  private _destroyed = new Subject<void>();
  // selectedMonth: FormControl<string[] | null> = new FormControl(null);

  constructor(
    private _calendar: MatCalendar<typeof DateAdapter>,
    private _dateAdapter: DateAdapter<typeof DateAdapter>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats,
    cdr: ChangeDetectorRef,
    public calService: O2DaterangeService,
  ) {
    _calendar.stateChanges
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());

    this.calService._availableMonths
      .pipe(takeUntil(this._destroyed))
      .subscribe(async () => {
        await sleep(0);
        this.setMonth();
      });

    this.calService.selectMonth
      .pipe(takeUntil(this._destroyed))
      .subscribe((value) => {
        const month = value && value[0];
        if (month) {
          const index = this.calService._availableMonths.value.findIndex(
            (monthVal) => monthVal.value === month,
          );

          if (index > -1) {
            const updateMonths = this.calService._availableMonths1.value.map(
              (month, idx) => {
                if (idx <= index) {
                  return { ...month, disable: true };
                } else {
                  return { ...month, disable: false };
                }
              },
            );

            this.calService._availableMonths1.next(updateMonths);
          }
        }
      });

    this.setMonth();
  }

  setMonth() {
    const activeDate = this._calendar.activeDate.toString();
    const month = dayjs(activeDate).format('MMMM YYYY')?.toLowerCase();
    this.calService.selectMonth.next([month]);
  }

  onChangeMonth(selectedMonth: string[]) {
    this.calService.selectMonth.next(selectedMonth);
    this.goToMonth(selectedMonth[0]);
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  isSame(date: string): boolean {
    const activeDate = this._calendar.activeDate.toString();
    return dayjs(activeDate).isSame(dayjs(date), 'month');
  }

  goToMonth(month: string) {
    const [y, m, d] = dayjs(month).toArray();
    this._calendar.activeDate = this._dateAdapter.createDate(y, m, d);
  }
}
