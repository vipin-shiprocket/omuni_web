import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';
import { MavenAppConfig } from 'src/app/utils/config';

@Component({
  selector: 'app-app-launcher',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MatIconModule, MatButtonModule],
  templateUrl: './app-launcher.component.html',
  styleUrls: ['./app-launcher.component.scss'],
})
export class AppLauncherComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
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

  constructor(
    public auth: AuthService,
    private http: HttpService,
  ) {}

  ngOnInit(): void {
    this.getUserApps();
  }

  getUserApps() {
    const baseUrl = window.location.origin;
    const endpoint = '/api/auth/authservice/webapi/session/apps';
    const url = baseUrl + endpoint;

    this.subs.sink = this.http.requestByUrl(url).subscribe({
      next: (resp) => {
        console.log(resp);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
