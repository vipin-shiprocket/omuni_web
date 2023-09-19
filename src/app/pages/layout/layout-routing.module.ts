import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { authGuard } from 'src/app/core/auth.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: LayoutComponent,
    children: [
      {
        path: 'orders',
        loadComponent: () =>
          import('../orders/orders.component').then((c) => c.OrdersComponent),
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
    ],
    canActivate: [authGuard],
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
