import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IOption, O2SelectModules } from './o2-select.model';
import { ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { noop } from 'rxjs';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SubSink } from 'subsink';

type SELECT_VALUE_TYPE = (string | number | boolean)[];

@Component({
  selector: 'app-o2-select',
  standalone: true,
  imports: [CommonModule, O2SelectModules],
  templateUrl: './o2-select.component.html',
  styleUrls: ['./o2-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: O2SelectComponent,
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class O2SelectComponent implements ControlValueAccessor, OnDestroy {
  private subs = new SubSink();
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: unknown) => void = noop;
  @ViewChild('trigger') select!: ElementRef;
  @ViewChild('portal') portal!: TemplateRef<ElementRef>;
  @Output() selectionChange = new EventEmitter();
  @Input() disabled = false;
  @Input() label = '';
  @Input() options: IOption[] = [];
  @Input() multiple = false;
  @Input() placeholder = '';
  @Input() selectAll = true;
  @Input() clearBtn = true;
  @Input() className = '';
  overlayRef!: OverlayRef;
  isOpened = signal(false);
  @Input() set values(value: SELECT_VALUE_TYPE) {
    if (value) {
      this.selectedValues = value;
      this.onChangeCallback(this.selectedValues);
    }
  }
  selectedValues: SELECT_VALUE_TYPE = [];

  constructor(
    private overlay: Overlay,
    private cd: ChangeDetectorRef,
    private _viewContainerRef: ViewContainerRef,
  ) {}

  writeValue(value: (string | number)[]): void {
    this.selectedValues = value;
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

  get allSelected(): boolean {
    return this.selectedValues?.length === this.options?.length;
  }

  formatValue(value: SELECT_VALUE_TYPE): string {
    // console.log('🚀 ~ formatValue ~ value:', value);
    if (!value?.length) {
      return this.placeholder || `Select ${this.label}`;
    }

    if (!this.multiple) {
      const seclected = this.options.find((option) => {
        return option.value === value[0];
      });

      return seclected?.display.toString() || '';
    }
    return `${value.length} ${this.label} Selected`;
  }

  onSelectionChange(selected: ListboxValueChangeEvent<unknown>) {
    this.selectedValues = selected.value as SELECT_VALUE_TYPE;
    this.emitChange();

    if (!this.multiple) {
      this.toggleDropd();
    }
  }

  handleSelectAll() {
    if (this.allSelected) {
      this.clearFilter();
    } else {
      this.selectedValues = this.options.map((o) => o.value);
    }

    this.emitChange();
  }

  private syncWidth(): void {
    if (!this.overlayRef) {
      return;
    }
    const refRectWidth =
      this.select.nativeElement.getBoundingClientRect().width;
    this.overlayRef.updateSize({ width: refRectWidth });
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

  toggleDropd() {
    if (!this.overlayRef?.hasAttached()) {
      this.overlayRef = this.overlay.create(this.getOverlayConfig());
      this.overlayRef.attach(
        new TemplatePortal(this.portal, this._viewContainerRef),
      );
      this.syncWidth();
      this.isOpened.set(true);

      const overlaySubs = this.overlayRef.backdropClick().subscribe(() => {
        this.overlayRef.dispose();
        this.isOpened.set(false);
        overlaySubs.unsubscribe();
      });
    }
  }

  emitChange() {
    this.selectionChange.emit(this.selectedValues);
    this.onChangeCallback(this.selectedValues);
    this.cd.markForCheck();
  }

  clearFilter() {
    this.selectedValues = [];
    this.emitChange();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
