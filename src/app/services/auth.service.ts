import { Injectable, OnDestroy } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
// import { AuthenticateResp } from '../pages/auth/auth.model';
import { HttpService } from './http.service';
import { SubSink } from 'subsink';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  private subs = new SubSink();

  constructor(
    private cookie: CookieService,
    private http: HttpService,
  ) {}

  // Variables declarations
  googleConfig = {
    endPoint: 'https://accounts.google.com/o/oauth2/v2/auth?',
    params: {
      client_id: environment.googleAuthClientID,
      response_type: 'code',
      scope: 'email profile',
      include_granted_scopes: 'true',
      redirect_uri: window.location.origin + '/login',
      // state: this.mergeAllParams('google'),
    },
  };
  googleAuth() {
    // this.googleConfig.params['state'] = this.mergeAllParams('google');
    let qeryString = '';
    const params: Record<string, string> = this.googleConfig.params;
    Object.keys(params).forEach((key) => {
      // const a = params[key];
      qeryString += key + '=' + params[key] + '&';
    });
    const win = window.open(
      this.googleConfig['endPoint'] + qeryString,
      'poop',
      'height=633,width=550,top=20,left=500',
    );
    // console.log('win is- ', this.windowHandle);
    const pollTimer = window.setInterval(function () {
      try {
        if (win && win.location.href != 'about:blank') {
          window.clearInterval(pollTimer);
          win.opener.location = win.document.location.href;
          win.close();
        }
      } catch (e) {
        //Catch statement here
      }
    }, 100);
  }

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
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
