import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'src/app/services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';
import { AvailableApp, IAppModal, IUserApp } from './app-launcher.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { mergeMap } from 'rxjs';

@Component({
  selector: 'app-app-launcher',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, MatIconModule, MatButtonModule],
  templateUrl: './app-launcher.component.html',
  styleUrls: ['./app-launcher.component.scss'],
})
export class AppLauncherComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  apps: IAppModal[] = [];
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
    const endpoint = '/authservice/webapi/session/apps';
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
                this.redirectToOMS();
                break;

              case 'FMS':
                this.redirectToFMS();
                break;

              case 'WMS':
                this.redirectToWMS();
                break;

              case 'AMS':
                this.redirectToAMS();
                break;

              default:
                break;
            }
          } else {
            resp.forEach((menu) => {
              const name = menu?.app?.name?.toLowerCase();
              const app = { ...AvailableApp[name] };
              app.data = menu;
              this.apps.push(app);
            });
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  redirectToOMS() {
    const email = this.auth.getEmail();
    this.subs.sink = this.auth
      .checkOmsClientFirstTime(email)
      .pipe(
        mergeMap(() => this.auth.checkOmsUserFirstTime(email)),
        mergeMap(() => this.auth.getOMSMenu()),
      )
      .subscribe({
        next: (resp) => {
          console.log('🚀 ~ redirectToOMS ~ resp:', resp);

          if (resp) {
            this.$localStorage.set('menu', JSON.stringify(resp));
            if (resp && resp[0]['href'] !== undefined) {
              window.location.href = 'oms/#' + resp[0]['href'];
            } else {
              const subMenu = resp[0]['subMenu'] as Record<string, string>[];
              window.location.href = 'oms/#' + subMenu[0]['href'];
            }
          }
        },
        error(err) {
          console.error(err);
        },
      });
  }

  redirectToFMS() {
    this.subs.sink = this.auth.getFMSMenu().subscribe({
      next: (resp) => {
        const menu = resp.data;
        this.$localStorage.set('FMS', JSON.stringify({ menu }));
        // this.$localStorage.set('userdata', null);
        document.location.href = window.location.origin + '/fms/#/';
      },
      error(err) {
        console.error(err);
      },
    });
  }

  redirectToWMS() {
    window.location.href = window.location.origin + '/wms/#/home';
  }

  redirectToAMS() {
    window.location.href = window.location.origin + '/ams/#/reports';
  }

  onClickApp(appName: string) {
    switch (appName) {
      case 'OMS':
        this.redirectToOMS();
        break;

      case 'FMS':
        this.redirectToFMS();
        break;

      case 'WMS':
        this.redirectToWMS();
        break;

      case 'AMS':
        this.redirectToAMS();
        break;

      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
