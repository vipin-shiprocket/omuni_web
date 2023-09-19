import { Component, ViewEncapsulation, inject } from '@angular/core';
import { SingleOrderService } from '../single-order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailsComponent {
  soService = inject(SingleOrderService);

  onClickNext() {
    this.soService.onTabChange('next');
  }

  onClickBack() {
    this.soService.onTabChange('prev');
  }
}
