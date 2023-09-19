import { Component, inject } from '@angular/core';
import { TabListSingleOrder } from '../add-order.model';
import { SingleOrderService } from './single-order.service';

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.scss'],
})
export class SingleOrderComponent {
  soService = inject(SingleOrderService);
  tabs = this.soService.tabs;
}
