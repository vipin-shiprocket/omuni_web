import { Injectable, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
// import { AuthenticateResp } from '../pages/auth/auth.model';
import { HttpService } from './http.service';
import { SubSink } from 'subsink';
// import { Observable } from 'rxjs';
// import { IMenu } from '../pages/app-launcher/app-launcher.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private subs = new SubSink();

  constructor(
    private cookie: CookieService,
    private http: HttpService,
  ) {}

  setLoggedIn() {
    this.cookie.set('isLoggedIn', 'true');
  }

  isLoggedIn(): boolean {
    let isLoggedIn = false;
    try {
      const login = this.cookie.get('isLoggedIn');
      if (login == 'true') {
        isLoggedIn = true;
      } else {
        isLoggedIn = false;
      }
    } catch (error) {
      isLoggedIn = false;
    }

    return isLoggedIn;
  }

  logout() {
    this.cookie.set('isLoggedIn', 'false');
    // const endpoint = '/api/auth/authservice/webapi/session/logout';
    // const baseUrl = window.location.origin;
    // this.subs.sink = this.http.postByUrl(baseUrl + endpoint, {}).subscribe({
    //   next: () => {
    //     localStorage.clear();
    //     this.cookie.set('isLoggedIn', 'false');
    //     window.location.href = window.location.origin + '/v2/login';
    //   },
    //   error: (err) => {
    //     console.error(err);
    //   },
    // });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
