import {
  Directive,
  Input,
  TemplateRef,
  ElementRef,
  ComponentRef,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
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
  @Input() connectedPositions!: ConnectedPosition[];
  @Input() contentText = '';
  @Input({ required: true }) dropDownMode!: 'dropDown' | 'toolTip';
  @Output() dropEvents = new EventEmitter<'open' | 'close'>();
  scrollStrategy: unknown;
  private _overlayRef!: OverlayRef;
  private subs = new SubSink();
  private toolTipRef!: ComponentRef<CustomToolTipComponent>;

  constructor(
    private _overlay: Overlay,
    private _elementRef: ElementRef,
  ) {
    if (!this.connectedPositions) {
      this.connectedPositions = [
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
    }
  }

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
    this.subs.sink = this._overlayRef
      .backdropClick()
      .subscribe(() => this.hide());
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
    this.dropEvents.emit('open');
  }

  hide() {
    this.dropEvents.emit('close');
    this.closeToolTip();
  }

  ngOnDestroy() {
    this.closeToolTip();
    this.subs.unsubscribe();
    if (this._overlayRef) this._overlayRef.dispose();
  }

  private async closeToolTip() {
    if (this.toolTipRef) this.toolTipRef.instance.isOpen = false;

    await sleep(200);

    if (this._overlayRef) {
      this._overlayRef.detach();
    }
  }
}
