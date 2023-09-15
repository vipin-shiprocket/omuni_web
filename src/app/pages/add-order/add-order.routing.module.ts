import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddOrderComponent } from './add-order.component';
import { SingleOrderComponent } from './single-order/single-order.component';
import { BulkOrderComponent } from './bulk-order/bulk-order.component';

const routes: Routes = [
  {
    path: '',
    component: AddOrderComponent,
    children: [
      { path: 'single', component: SingleOrderComponent },
      { path: 'bulk', component: BulkOrderComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddOrdersRoutingModule {}
