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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { O2SelectComponent } from 'src/app/components/o2-select/o2-select.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AddressWizardComponent } from 'src/app/components/address-wizard/address-wizard.component';

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
    FormsModule,
    ReactiveFormsModule,
    AddOrdersRoutingModule,
    O2SelectComponent,
    MatAutocompleteModule,
    MatIconModule,
    MatTabsModule,
    MatIconModule,
    AddressWizardComponent,
  ],
})
export class AddOrderModule {}
