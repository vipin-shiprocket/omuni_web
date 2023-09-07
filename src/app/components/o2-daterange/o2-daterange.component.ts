import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DATE_RANGE,
  DateOptions,
  O2DaterangeModules,
  getLastFiveYear,
  isDateGreaterThanToday,
} from './o2-daterange.model';
import { ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CalendarHeaderComponent } from './calender-header.component';
import { FormControl } from '@angular/forms';
import { SubSink } from 'subsink';
import { IOption } from '../chip-selectbox/chip-selectbox.model';
import { O2DaterangeService } from './o2-daterange.service';
import dayjs from 'dayjs';
import { DateRange, MatCalendar } from '@angular/material/datepicker';
import { sleep } from 'src/app/utils/utils';

@Component({
  selector: 'app-o2-daterange',
  standalone: true,
  imports: [CommonModule, O2DaterangeModules],
  templateUrl: './o2-daterange.component.html',
  styleUrls: ['./o2-daterange.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class O2DaterangeComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  @ViewChild('calendarOne') calendarOne!: MatCalendar<Date>;
  @ViewChild('calendarTwo') calendarTwo!: MatCalendar<Date>;
  @ViewChild('trigger') select!: ElementRef;
  @ViewChild('portal') portal!: TemplateRef<ElementRef>;
  @Input() set optionsRange(value: DateOptions[]) {
    if (value) {
      this.options = value.map((option) => DATE_RANGE[option]);
    }
  }
  @Input() disabled = false;
  options = Object.values(DATE_RANGE);
  selectedValues = [];
  overlayRef!: OverlayRef;
  header = CalendarHeaderComponent;
  yearOptions = getLastFiveYear().map((year) => {
    const currYear = new Date().getFullYear().toString();
    if (currYear === year) {
      return { display: 'Last one year', value: year };
    } else {
      return { display: year, value: year };
    }
  });
  selectedYear: FormControl<IOption[]> = new FormControl();
  minDate: Date | undefined;
  maxDate: Date | undefined;
  calendarOneStart: Date | undefined;
  calendarTwoStart: Date | undefined;
  selectedDateRange: DateRange<Date> | null = null;

  constructor(
    private overlay: Overlay,
    private cd: ChangeDetectorRef,
    private _viewContainerRef: ViewContainerRef,
    public calService: O2DaterangeService,
  ) {}

  ngOnInit(): void {
    this.subs.sink = this.calService._availableMonths.subscribe((range) => {
      if (range?.length) {
        this.minDate = dayjs(range[0].value as string).toDate();
        const lastDate = dayjs(range[range.length - 1].value as string)
          .endOf('M')
          .toDate();

        this.maxDate = isDateGreaterThanToday(lastDate) ? new Date() : lastDate;
        this.calendarOneStart = this.minDate;
        this.calendarTwoStart = this.maxDate;
        this.selectedDateRange = new DateRange(this.minDate, this.maxDate);
        this.goToDateInView();
      }
    });

    this.subs.sink = this.selectedYear.valueChanges.subscribe((value) => {
      const currYear = new Date().getFullYear().toString();
      const year = value[0].value;
      if (currYear === year) {
        this.calService.computeValidMonths();
      } else {
        this.calService.computeValidMonths(year as string);
      }
    });

    this.setSelectedYear();
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
      this.selectedYear.patchValue([this.yearOptions[index]]);
    }

    // set minDate and maxDate
  }

  onSelectionChange(selected: ListboxValueChangeEvent<unknown>) {
    console.log('🚀 ~ onSelectionChange ~ selected:', selected);
    // todo
  }

  formatValue(value: unknown): string {
    return 'Select Range';
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
      ]);

    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    return new OverlayConfig({
      positionStrategy: positionStrategy,
      scrollStrategy: scrollStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });
  }

  // private syncWidth(): void {
  //   if (!this.overlayRef) {
  //     return;
  //   }
  //   const refRectWidth =
  //     this.select.nativeElement.getBoundingClientRect().width;
  //   this.overlayRef.updateSize({ width: refRectWidth });
  // }

  toggleDropd() {
    if (!this.overlayRef?.hasAttached()) {
      this.overlayRef = this.overlay.create(this.getOverlayConfig());

      this.overlayRef.attach(
        new TemplatePortal(this.portal, this._viewContainerRef),
      );
      // this.overlayRef.updateSize({ width: 219 });
      this.overlayRef.backdropClick().subscribe(() => {
        this.overlayRef.dispose();
      });
    } else {
      this.overlayRef.dispose();
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
