import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';
import { IUserApp } from './app-launcher.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';

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
    private $localStorage: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.getUserApps();
  }

  getUserApps() {
    const endpoint = '/api/auth/authservice/webapi/session/apps';
    this.subs.sink = this.http
      .requestToEndpoint<IUserApp[]>(endpoint)
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.$localStorage.set('userApps', JSON.stringify(resp));
          if (resp.length === 1) {
            const currentApp = resp[0].app.name;
            switch (currentApp) {
              case 'OMS':
                break;

              case 'FMS':
                break;

              case 'WMS':
                break;

              default:
                break;
            }
          }
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
