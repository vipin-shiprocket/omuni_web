import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DATE_RANGE,
  DateOptions,
  IDATE_RANGE,
  O2DaterangeModules,
  getLastFiveYear,
  isDateGreaterThanToday,
} from './o2-daterange.model';
import { ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CalendarHeaderComponent } from './calender-header.component';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { SubSink } from 'subsink';
import { O2DaterangeService } from './o2-daterange.service';
import dayjs from 'dayjs';
import {
  DateRange,
  MatCalendar,
  MatCalendarCellClassFunction,
} from '@angular/material/datepicker';
import { sleep } from 'src/app/utils/utils';
import { noop } from 'rxjs';
import { CalendarHeaderOneComponent } from './calender-header1.component';

@Component({
  selector: 'app-o2-daterange',
  standalone: true,
  imports: [CommonModule, O2DaterangeModules],
  templateUrl: './o2-daterange.component.html',
  styleUrls: ['./o2-daterange.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: O2DaterangeComponent,
      multi: true,
    },
  ],
})
export class O2DaterangeComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  private subs = new SubSink();
  private onTouchedCallback = noop;
  private onChangeCallback: (_: unknown) => void = noop;
  @ViewChild('calendarOne') calendarOne!: MatCalendar<Date>;
  @ViewChild('calendarTwo') calendarTwo!: MatCalendar<Date>;
  @ViewChild('trigger') select!: ElementRef;
  @ViewChild('portal') portal!: TemplateRef<ElementRef>;
  @Output() selectionChange = new EventEmitter<Array<Date | null>>();
  @Input() set optionsRange(value: DateOptions[]) {
    if (value) {
      this.options = value.map((option) => DATE_RANGE[option]);
    }
  }
  @Input() disabled = false;
  options = Object.values(DATE_RANGE);
  selectedValues: IDATE_RANGE[] = [];
  overlayRef!: OverlayRef;
  header = CalendarHeaderComponent;
  header1 = CalendarHeaderOneComponent;
  yearOptions = getLastFiveYear().map((year) => {
    const currYear = new Date().getFullYear().toString();
    if (currYear === year) {
      return { display: 'Last one year', value: year };
    } else {
      return { display: year, value: year };
    }
  });
  selectedYear: FormControl<string[]> = new FormControl();
  minDate: Date | null = null;
  maxDate: Date | null = null;
  selectedDateRange: DateRange<Date | null> = new DateRange(null, null);
  dateClass: MatCalendarCellClassFunction<Date | null> = (cellDate, view) => {
    if (view === 'month') {
      return 'month-view';
    }
    return '';
  };
  isOpened = signal(false);

  constructor(
    private overlay: Overlay,
    private cd: ChangeDetectorRef,
    public _viewContainerRef: ViewContainerRef,
    public calService: O2DaterangeService,
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.calService._availableMonths.subscribe(() =>
      this.updateMonthYearNCalender(),
    );

    this.setSelectedYear();
  }

  onYearChange(year: Array<string>) {
    const currYear = new Date().getFullYear().toString();
    if (currYear === year[0]) {
      this.calService.computeValidMonths();
    } else {
      this.calService.computeValidMonths(year[0]);
    }
  }

  updateMonthYearNCalender() {
    const range = this.calService._availableMonths.value;
    if (range?.length) {
      this.minDate = dayjs(range[0].value as string).toDate();
      const lastDate = dayjs(range[range.length - 1].value as string)
        .endOf('M')
        .toDate();

      this.maxDate = isDateGreaterThanToday(lastDate) ? new Date() : lastDate;
      this.updateDateRangeOnYearChange();
      this.goToDateInView();
    }
  }

  async updateDateRangeOnYearChange() {
    await sleep(0);
    const date = this.selectedDateRange.end;
    if (date) {
      const year = date.getFullYear();
      const [selectedYear] = this.selectedYear.value;
      if (year !== +selectedYear) {
        this.selectedDateRange = new DateRange(this.minDate, this.maxDate);
      }
    }
  }

  onDateChange(date: Date | null): void {
    if (!date) {
      return;
    }

    let range = this.selectedDateRange ?? new DateRange(null, null);

    if (range.start && !range.end) {
      if (date < range.start) {
        range = new DateRange(date, null);
      } else {
        range = new DateRange(range.start, date);
      }
    } else {
      range = new DateRange(date, null);
    }

    this.selectedDateRange = range;
  }

  async goToDateInView() {
    const start = this.selectedDateRange?.start;
    const end = this.selectedDateRange?.end;
    await sleep(0);

    if (start) this.calendarOne?._goToDateInView(start, 'month');
    if (end) this.calendarTwo?._goToDateInView(end, 'month');
  }

  setSelectedYear(year?: number | string) {
    const _year = year ?? new Date().getFullYear();
    const index = this.yearOptions.findIndex((option) => {
      return +option.value === +_year;
    });

    if (index !== -1) {
      this.selectedYear.setValue([this.yearOptions[index].value], {
        emitEvent: false,
      });
    }
  }

  onSelectionChange(selected: ListboxValueChangeEvent<unknown>) {
    const value = selected.value as IDATE_RANGE[];
    const range = value[0].range;
    const isCustomRange = value[0].key !== DateOptions.CUSTOM_RANGE;
    if (range?.length) {
      this.selectedDateRange = new DateRange(
        range[0].toDate(),
        range[1].toDate(),
      );
    } else {
      this.selectedDateRange = new DateRange(
        this.minDate ?? null,
        this.maxDate ?? null,
      );
    }

    this.setSelectedYear(range[1]?.year());
    this.cd.markForCheck();

    if (isCustomRange) {
      this.onClickApply();
    }
  }

  formatValue(): string {
    if (
      this.selectedValues?.length &&
      this.selectedValues[0].key !== DateOptions.CUSTOM_RANGE
    ) {
      return this.selectedValues[0].label;
    } else {
      const start = this.selectedDateRange?.start;
      const end = this.selectedDateRange?.end;

      return start && end
        ? `${dayjs(start).format('DD/MM/YYYY')} - ${dayjs(end).format(
            'DD/MM/YYYY',
          )}`
        : 'Select Range';
    }
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.select)
      .withPush(true)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 6,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -6,
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'top',
          offsetY: -6,
        },
      ]);

    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    return new OverlayConfig({
      positionStrategy: positionStrategy,
      scrollStrategy: scrollStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });
  }

  toggleDropd() {
    if (!this.overlayRef?.hasAttached()) {
      this.overlayRef = this.overlay.create(this.getOverlayConfig());

      this.overlayRef.attach(
        new TemplatePortal(this.portal, this._viewContainerRef),
      );

      this.isOpened.set(true);
      const overlaySubs = this.overlayRef.backdropClick().subscribe(() => {
        this.overlayRef.dispose();
        overlaySubs.unsubscribe();
        this.isOpened.set(false);
      });
    }
  }

  emitChange() {
    const start = this.selectedDateRange?.start ?? null;
    const end = this.selectedDateRange?.end ?? null;

    this.selectionChange.emit([start, end]);
    const customRange = DATE_RANGE.custom_range;
    customRange.range = [dayjs(start), dayjs(end)];
    this.onChangeCallback([start, end]);
    this.cd.markForCheck();
  }

  setDateOptionByDate(daterange: string[]) {
    const index = this.options.findIndex((option) => {
      const startDate = dayjs(daterange[0]).isSame(option.range[0], 'dates');
      const endDate = dayjs(daterange[1]).isSame(option.range[1], 'dates');
      return startDate && endDate;
    });

    if (index === -1) {
      const customRange = DATE_RANGE.custom_range;
      customRange.range = [dayjs(daterange[0]), dayjs(daterange[1])];
      this.selectedValues = [customRange];
    } else {
      this.selectedValues = [this.options[index]];
    }
  }

  setDateRange(dateRange: Date[]) {
    this.selectedDateRange = new DateRange(dateRange[0], dateRange[1]);
  }

  writeValue(value: string[]): void {
    if (value?.length) {
      this.setDateRange([new Date(value[0]), new Date(value[1])]);
    }

    this.setSelectedYear(new Date(value[1]).getFullYear());
    this.setDateOptionByDate(value);
    this.emitChange();
  }

  registerOnChange(fn: typeof this.onChangeCallback): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: typeof this.onTouchedCallback): void {
    this.onTouchedCallback = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onClickCancel() {
    const custom = DATE_RANGE.custom_range;
    if (custom.range?.length) {
      this.setDateRange([custom.range[0].toDate(), custom.range[1].toDate()]);
    } else {
      this.selectedDateRange = new DateRange(null, null);
    }
    this.toggleDropd();
  }

  onClickApply() {
    this.emitChange();
    this.toggleDropd();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
