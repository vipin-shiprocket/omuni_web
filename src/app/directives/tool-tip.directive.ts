import {
  Directive,
  Input,
  TemplateRef,
  ElementRef,
  HostListener,
  ComponentRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  ConnectedPosition,
  Overlay,
  OverlayConfig,
  OverlayRef,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { CustomToolTipComponent } from '../components/custom-tool-tip/custom-tool-tip.component';
import { ComponentPortal } from '@angular/cdk/portal';

@Directive({
  selector: '[appToolTip]',
  standalone: true,
})
export class ToolTipRendererDirective implements OnInit, OnDestroy {
  @Input() showToolTip = true;
  @Input() customToolTip?: string;
  @Input() contentTemplate?: TemplateRef<unknown>;
  @Input() connectedPositions: ConnectedPosition[] = [
    {
      originX: 'center',
      originY: 'bottom',
      overlayX: 'center',
      overlayY: 'top',
      offsetY: 6,
      panelClass: 'arrowTop',
    },
    {
      originX: 'center',
      originY: 'top',
      overlayX: 'center',
      overlayY: 'bottom',
      offsetY: -6,
      panelClass: 'arrowBottom',
    },
  ];
  scrollStrategy: unknown;

  private _overlayRef!: OverlayRef;

  constructor(
    private _overlay: Overlay,
    private _elementRef: ElementRef,
  ) {}

  ngOnInit() {
    if (!this.showToolTip) {
      return;
    }

    const positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this._elementRef)
      .withPush(true)
      .withPositions(this.connectedPositions);

    this.scrollStrategy = this._overlay.scrollStrategies.close();

    const config = new OverlayConfig({
      positionStrategy: positionStrategy,
      scrollStrategy: this.scrollStrategy as ScrollStrategy,
    });

    this._overlayRef = this._overlay.create(config);
  }

  @HostListener('mouseenter')
  show() {
    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      const tooltipRef: ComponentRef<CustomToolTipComponent> =
        this._overlayRef.attach(new ComponentPortal(CustomToolTipComponent));
      (this.scrollStrategy as ScrollStrategy).enable();
      tooltipRef.instance.text = this.customToolTip || '';
      tooltipRef.instance.contentTemplate = this.contentTemplate;
    }
  }

  @HostListener('mouseleave')
  hide() {
    this.closeToolTip();
  }

  ngOnDestroy() {
    this.closeToolTip();
    this._overlayRef.dispose();
  }

  private closeToolTip() {
    if (this._overlayRef) {
      this._overlayRef.detach();
    }
  }
}
