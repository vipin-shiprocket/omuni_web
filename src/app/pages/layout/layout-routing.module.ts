import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'orders',
        loadComponent: () =>
          import('../orders/orders.component').then((c) => c.OrdersComponent),
      },
      {
        path: 'add-order',
        loadChildren: () =>
          import('../add-order/add-order.module').then((m) => m.AddOrderModule),
      },
      {
        path: 'products',
        children: [
          {
            path: 'inventory',
            loadComponent: () =>
              import('../inventory/inventory.component').then(
                (c) => c.InventoryComponent,
              ),
          },
          {
            path: 'catalog',
            loadComponent: () =>
              import('../catalog/catalog.component').then(
                (c) => c.CatalogComponent,
              ),
          },
        ],
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('../settings/settings.component').then(
            (c) => c.SettingsComponent,
          ),
      },
    ],
    // canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  }, // redirect to `login`
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
