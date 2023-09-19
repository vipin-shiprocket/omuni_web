import { Component, ViewEncapsulation, inject } from '@angular/core';
import { SingleOrderService } from '../single-order.service';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PackageDetailsComponent {
  soService = inject(SingleOrderService);

  onClickBack() {
    this.soService.onTabChange('prev');
  }
}
