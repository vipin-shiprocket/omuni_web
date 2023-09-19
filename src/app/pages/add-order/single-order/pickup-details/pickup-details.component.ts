import { Component, ViewEncapsulation, inject } from '@angular/core';
import { SingleOrderService } from '../single-order.service';

@Component({
  selector: 'app-pickup-details',
  templateUrl: './pickup-details.component.html',
  styleUrls: ['./pickup-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PickupDetailsComponent {
  soService = inject(SingleOrderService);

  onClickNext() {
    this.soService.onTabChange('next');
  }

  onClickBack() {
    this.soService.onTabChange('prev');
  }
}
