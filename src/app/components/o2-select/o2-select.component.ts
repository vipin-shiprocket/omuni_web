import {
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
import { IOption, O2SelectModules, chipSelectboxType } from './o2-select.model';
import { ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-o2-select',
  standalone: true,
  imports: [CommonModule, O2SelectModules],
  templateUrl: './o2-select.component.html',
  styleUrls: ['./o2-select.component.scss'],
})
export class O2SelectComponent {
  @ViewChild('trigger') select!: ElementRef;
  @ViewChild('portal') portal!: TemplateRef<ElementRef>;
  @Output() selectionChange = new EventEmitter();
  @Input() disabled = false;
  @Input() label = '';
  @Input() options: IOption[] = [];
  @Input() multiple = false;
  overlayRef!: OverlayRef;
  @Input() set values(value: IOption[] | undefined) {
    if (value) {
      this.selectedValues = value;
    }
  }
  selectedValues: IOption[] = [];

  constructor(
    private overlay: Overlay,
    private _viewContainerRef: ViewContainerRef,
  ) {}

  formatValue(value: IOption[]): string {
    if (!value.length) return '';

    if (!this.multiple) {
      return value[0].display;
    }
    return `${value.length} ${this.label} Selected`;
  }

  onSelectionChange(selected: ListboxValueChangeEvent<unknown>) {
    this.selectionChange.emit(selected.value);
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
          offsetY: 4,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom',
          offsetY: -4,
        },
      ]);

    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    return new OverlayConfig({
      positionStrategy: positionStrategy,
      scrollStrategy: scrollStrategy,
      hasBackdrop: true,
      maxHeight: '10rem',
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
}
