import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IOption, O2SelectModules } from './o2-select.model';
import { ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-o2-select',
  standalone: true,
  imports: [CommonModule, O2SelectModules],
  templateUrl: './o2-select.component.html',
  styleUrls: ['./o2-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class O2SelectComponent {
  @ViewChild('trigger') select!: ElementRef;
  @ViewChild('portal') portal!: TemplateRef<ElementRef>;
  @Output() selectionChange = new EventEmitter();
  @Input() disabled = false;
  @Input() label = '';
  @Input() options: IOption[] = [];
  @Input() multiple = false;
  @Input() placeholder = '';
  @Input() selectAll = false;
  @Input() clearBtn = true;
  overlayRef!: OverlayRef;
  @Input() set values(value: IOption[] | undefined) {
    if (value) {
      this.selectedValues = value;
    }
  }
  selectedValues: IOption[] = [];

  constructor(
    private overlay: Overlay,
    private cd: ChangeDetectorRef,
    private _viewContainerRef: ViewContainerRef,
  ) {}

  get allSelected(): boolean {
    return this.selectedValues.length === this.options.length;
  }

  formatValue(value: IOption[]): string {
    if (!value.length) {
      return this.placeholder || `Select ${this.label}`;
    }

    if (!this.multiple) {
      return value[0].display;
    }
    return `${value.length} ${this.label} Selected`;
  }

  onSelectionChange(selected: ListboxValueChangeEvent<unknown>) {
    this.selectedValues = selected.value as IOption[];
    this.selectionChange.emit(this.selectedValues);
    this.cd.markForCheck();
  }

  handleSelectAll() {
    if (this.allSelected) {
      this.clearFilter();
    } else {
      this.selectedValues = this.options;
    }

    this.selectionChange.emit(this.selectedValues);
    this.cd.markForCheck();
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
      this.overlayRef.backdropClick().subscribe(() => {
        this.overlayRef.dispose();
      });
    } else {
      this.overlayRef.dispose();
    }
  }

  clearFilter() {
    this.selectedValues = [];
    this.selectionChange.emit(this.selectedValues);
    this.cd.markForCheck();
  }
}
