import {
  trigger,
  state,
  style,
  transition,
  animate,
  AnimationEvent,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

/**
 * DO NOT USE THIS COMPONENT DIRECTLY!!!
 *
 * This component will be used as an overlay template by ToolTipRenderer directive
 *
 * 1. `text` - Simple string to be shown in the tooltip
 * 2. `contentTemplate` - Pass an HTML template if needed
 *
 * **Only one should be used; If both are specified then `contentTemplate` will be rendered and `text` will be ignored**
 */
@Component({
  selector: 'app-custom-tool-tip',
  templateUrl: './custom-tool-tip.component.html',
  imports: [CommonModule],
  standalone: true,
  animations: [
    trigger('openClose', [
      state(
        'void',
        style({
          transform: 'translate3d(0, var(--popup-open-direction), 0)',
          opacity: 0,
        }),
      ),
      state('enter', style({ transform: 'none', opacity: 1 })),
      state(
        'leave',
        style({
          transform: 'translate3d(0, var(--popup-open-direction), 0)',
          opacity: 0,
        }),
      ),
      transition('* => *', animate('200ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
    ]),
  ],
})
export class CustomToolTipComponent {
  @Input() text?: string;
  @Input() contentTemplate?: TemplateRef<unknown>;
  @Input() isOpen = false;

  private arrowColor!: string;

  onAnimationEvent(event: AnimationEvent) {
    const el = event.element as HTMLElement;

    if (event.toState === 'enter' && event.phaseName === 'start') {
      this.arrowColor = el.style.getPropertyValue('--popup-arrow-color');
      el.style.setProperty('--popup-arrow-color', 'transparent');
    }

    if (event.toState === 'enter' && event.phaseName === 'done') {
      el.style.setProperty('--popup-arrow-color', this.arrowColor);
    }
  }
}
