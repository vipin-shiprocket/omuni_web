import {
  Directive,
  Input,
  TemplateRef,
  ElementRef,
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
import { Observable, filter, fromEvent } from 'rxjs';
import { SubSink } from 'subsink';
import { sleep } from '../utils/utils';

@Directive({
  selector: '[appDropdown]',
  standalone: true,
})
export class DropdownRendererDirective implements OnInit, OnDestroy {
  @Input() showDropdown = true;
  @Input() closeSignal?: Observable<void>;
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
  @Input() contentText = '';
  @Input({ required: true }) dropDownMode!: 'dropDown' | 'toolTip';
  scrollStrategy: unknown;
  private _overlayRef!: OverlayRef;
  private subs = new SubSink();
  private toolTipRef!: ComponentRef<CustomToolTipComponent>;

  constructor(
    private _overlay: Overlay,
    private _elementRef: ElementRef,
  ) {}

  ngOnInit() {
    if (!this.showDropdown) {
      return;
    }

    if (this.closeSignal) {
      this.subs.sink = this.closeSignal.subscribe(() => this.hide());
    }

    this.bindEvents();

    this.setOverlay();
  }

  setOverlay() {
    const positionStrategy = this._overlay
      .position()
      .flexibleConnectedTo(this._elementRef)
      .withPush(true)
      .withPositions(this.connectedPositions);

    this.scrollStrategy = this._overlay.scrollStrategies.close();

    const options: OverlayConfig = {
      positionStrategy: positionStrategy,
      scrollStrategy: this.scrollStrategy as ScrollStrategy,
    };

    if (this.dropDownMode === 'dropDown') {
      options['hasBackdrop'] = true;
      options['backdropClass'] = 'cdk-overlay-transparent-backdrop';
    }

    this._overlayRef = this._overlay.create(new OverlayConfig(options));
  }

  bindEvents() {
    this.subs.sink = fromEvent(document, 'keydown')
      .pipe(filter((val) => (val as KeyboardEvent).key === 'Escape'))
      .subscribe(() => this.hide());

    switch (this.dropDownMode) {
      case 'dropDown':
        this.subs.sink = fromEvent(
          this._elementRef.nativeElement,
          'click',
        ).subscribe(() => this.toggle());
        break;

      case 'toolTip':
        this.subs.sink = fromEvent(
          this._elementRef.nativeElement,
          'mouseenter',
        ).subscribe(() => this.show());
        this.subs.sink = fromEvent(
          this._elementRef.nativeElement,
          'mouseleave',
        ).subscribe(() => this.hide());
        break;
      default:
        break;
    }
  }

  toggle() {
    if (!this._overlayRef.hasAttached()) {
      this.show();
      const overlaySubs = this._overlayRef.backdropClick().subscribe(() => {
        this._overlayRef.detach();
        overlaySubs.unsubscribe();
      });
    } else {
      this.hide();
    }
  }

  show() {
    if (this._overlayRef && !this._overlayRef.hasAttached()) {
      this.toolTipRef = this._overlayRef.attach(
        new ComponentPortal(CustomToolTipComponent),
      );
      (this.scrollStrategy as ScrollStrategy).enable();
      this.toolTipRef.instance.text = this.contentText || '';
      this.toolTipRef.instance.contentTemplate = this.contentTemplate;
      this.toolTipRef.instance.isOpen = true;
    }
  }

  hide() {
    this.closeToolTip();
  }

  ngOnDestroy() {
    this.closeToolTip();
    this.subs.unsubscribe();
    this._overlayRef.dispose();
  }

  private async closeToolTip() {
    if (this.toolTipRef) this.toolTipRef.instance.isOpen = false;

    await sleep(200);

    if (this._overlayRef) {
      this._overlayRef.detach();
    }
  }
}
