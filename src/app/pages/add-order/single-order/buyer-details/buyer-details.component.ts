import { Component, ViewEncapsulation, inject } from '@angular/core';
import { SingleOrderService } from '../single-order.service';

@Component({
  selector: 'app-buyer-details',
  templateUrl: './buyer-details.component.html',
  styleUrls: ['./buyer-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BuyerDetailsComponent {
  soService = inject(SingleOrderService);

  onClickNext() {
    this.soService.onTabChange('next');
  }
}
