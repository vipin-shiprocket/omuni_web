import { Injectable, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticateResp } from '../pages/auth/auth.model';
import { HttpService } from './http.service';
import { SubSink } from 'subsink';
import { Observable } from 'rxjs';

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

  isLoggedIn(): boolean {
    let isLoggedIn = false;
    try {
      const login = this.cookie.get('isLoggedIn');
      isLoggedIn = JSON.parse(login);
    } catch (error) {
      isLoggedIn = false;
    }

    return isLoggedIn;
  }

  logout() {
    const endpoint = '/api/auth/authservice/webapi/session/logout';
    const baseUrl = window.location.origin;
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

  checkOmsClientFirstTime(email: string) {
    const encodedEmail = encodeURIComponent(email);
    const baseUrl = window.location.origin + '/api/oms';
    const endpoint = '/omsservices/webapi/clients/clientfirsttime';
    const params = {
      email: encodedEmail,
    };
    return this.http.requestByUrl(baseUrl + endpoint, params);
  }

  checkOmsUserFirstTime(email: string) {
    const encodedEmail = encodeURIComponent(email);
    const baseUrl = window.location.origin + '/api/oms';
    const endpoint = '/omsservices/webapi/omsusers/checkfirsttime';
    const params = {
      emailId: encodedEmail,
    };
    return this.http.requestByUrl(baseUrl + endpoint, params);
  }

  getOMSMenu(): Observable<
    Record<string, string | number | Record<string, string>[]>[]
  > {
    const baseUrl = window.location.origin + '/api/oms';
    const endpoint = '/omsservices/webapi/omsusers/menu';
    return this.http.requestByUrl(baseUrl + endpoint);
  }

  getFMSMenu(): Observable<{
    data: Record<string, string | number | Record<string, string>[]>[];
  }> {
    const baseUrl = window.location.origin + '/api/fms/fms/webapi';
    const endpoint = '/users/menu';
    return this.http.requestByUrl(baseUrl + endpoint);
  }

  getEmail(): string {
    return this.cookie.get('useremail');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
