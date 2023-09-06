import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
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
} from './o2-daterange.model';
import { ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CalendarHeaderComponent } from './calender-header.component';

@Component({
  selector: 'app-o2-daterange',
  standalone: true,
  imports: [CommonModule, O2DaterangeModules],
  templateUrl: './o2-daterange.component.html',
  styleUrls: ['./o2-daterange.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class O2DaterangeComponent {
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

  constructor(
    private overlay: Overlay,
    private cd: ChangeDetectorRef,
    private _viewContainerRef: ViewContainerRef,
  ) {}

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
}
