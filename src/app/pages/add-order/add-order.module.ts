import { NgModule } from '@angular/core';
import { AddOrderComponent } from './add-order.component';
import { CommonModule } from '@angular/common';
import { SingleOrderComponent } from './single-order/single-order.component';
import { BulkOrderComponent } from './bulk-order/bulk-order.component';
import { AddOrdersRoutingModule } from './add-order.routing.module';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BuyerDetailsComponent } from './single-order/buyer-details/buyer-details.component';
import { PickupDetailsComponent } from './single-order/pickup-details/pickup-details.component';
import { PackageDetailsComponent } from './single-order/package-details/package-details.component';
import { OrderDetailsComponent } from './single-order/order-details/order-details.component';

@NgModule({
  declarations: [
    AddOrderComponent,
    SingleOrderComponent,
    BulkOrderComponent,
    BuyerDetailsComponent,
    PickupDetailsComponent,
    PackageDetailsComponent,
    OrderDetailsComponent,
  ],
  imports: [
    CommonModule,
    AddOrdersRoutingModule,
    MatIconModule,
    MatTabsModule,
    MatIconModule,
  ],
})
export class AddOrderModule {}
