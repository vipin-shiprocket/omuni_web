import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-app-launcher',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MatIconModule, MatButtonModule],
  templateUrl: './app-launcher.component.html',
  styleUrls: ['./app-launcher.component.scss'],
})
export class AppLauncherComponent {
  apps = {
    fms: {
      id: 'fms',
      name: 'FMS',
      fullname: 'Freight Management System',
      logo: 'local_shipping',
    },
    oms: {
      id: 'oms',
      name: 'OMS',
      fullname: 'Order Management System',
      logo: 'add_shopping_cart',
    },
    wms: {
      id: 'wms',
      name: 'WMS',
      fullname: 'Warehouse Management System',
      logo: 'inventory_2',
    },
  };

  objectvalues = Object.values;

  constructor(public auth: AuthService) {}
}
