import { Injectable, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticateResp } from '../pages/auth/auth.model';
import { HttpService } from './http.service';
import { MavenAppConfig } from '../utils/config';
import { SubSink } from 'subsink';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private subs = new SubSink();

  constructor(
    private cookie: CookieService,
    private http: HttpService,
  ) {}

  setCookies(data: AuthenticateResp) {
    const authResponse = data as AuthenticateResp;

    this.cookie.set('username', authResponse.tableUserFirstName || '');
    this.cookie.set('userphone', authResponse?.tableUserPhoneNo || '');
    this.cookie.set('userfullname', authResponse?.tableFullName || '');
    this.cookie.set('useremail', authResponse?.tableUserEmailId || '');
    this.cookie.set('isLoggedIn', 'true');
    authResponse?.tableClient
      ? this.cookie.set(
          'timezone',
          authResponse?.tableClient.tableClientTimeZone || '',
        )
      : null;
  }

  logout() {
    const endpoint = '/authservice/webapi/session/logout';
    const baseUrl = MavenAppConfig.apigatewayauth;
    this.subs.sink = this.http.postByUrl(baseUrl + endpoint, {}).subscribe({
      next: () => {
        localStorage.clear();
        this.cookie.set('isLoggedIn', 'false');
        window.location.href = window.location.origin + '/login';
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getDomainNSubdomain() {
    let subdomain = '';
    let domain = '';
    const host = window.location.host;
    const parts = host.split('.');
    const isWWW = parts[0] === 'www';
    if (!isWWW) {
      if (parts.length === 2) {
        subdomain = '';
        domain = `${parts[0]}.${parts[1]}`;
      } else if (parts.length === 3) {
        subdomain = parts[0];
        domain = `${parts[1]}.${parts[2]}`;
      }
    } else {
      if (parts.length === 3) {
        subdomain = '';
        domain = `${parts[1]}.${parts[2]}`;
      } else if (parts.length === 4) {
        subdomain = parts[0];
        domain = `${parts[2]}.${parts[3]}`;
      }
    }
    return { domain, subdomain };
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
