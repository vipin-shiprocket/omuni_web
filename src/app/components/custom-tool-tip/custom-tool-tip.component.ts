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
})
export class CustomToolTipComponent {
  @Input() text?: string;
  @Input() contentTemplate?: TemplateRef<unknown>;
}
