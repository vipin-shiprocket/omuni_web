import { Component, inject } from '@angular/core';
import { SingleOrderService } from '../single-order.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
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
