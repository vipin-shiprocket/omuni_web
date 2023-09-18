import { Component } from '@angular/core';
import { TabListSingleOrder } from '../add-order.model';

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.scss'],
})
export class SingleOrderComponent {
  tabs = TabListSingleOrder;
  currentTab = 0;
}
