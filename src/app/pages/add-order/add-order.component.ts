import { Component } from '@angular/core';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss'],
})
export class AddOrderComponent {
  tabs = [
    {
      name: 'Domestic order',
      path: 'single',
    },
    {
      name: 'Bulk order',
      path: 'bulk',
    },
  ];
}
