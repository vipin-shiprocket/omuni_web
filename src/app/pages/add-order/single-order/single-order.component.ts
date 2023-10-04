import { Component, OnDestroy, inject } from '@angular/core';
import { SingleOrderService } from './single-order.service';

@Component({
  selector: 'app-single-order',
  templateUrl: './single-order.component.html',
  styleUrls: ['./single-order.component.scss'],
})
export class SingleOrderComponent implements OnDestroy {
  soService = inject(SingleOrderService);
  tabs = this.soService.tabs;

  ngOnDestroy(): void {
    this.soService.orderDetailDump.next(null);
  }
}
