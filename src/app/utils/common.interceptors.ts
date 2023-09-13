import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
// import { LoaderService } from '../services/loader.service';

@Injectable()
export class HttpconfigInterceptor implements HttpInterceptor {
  // For setting Authorization tocken in API

  intercept(
    req: HttpRequest<undefined>,
    next: HttpHandler,
  ): Observable<HttpEvent<undefined>> {
    // Clone the request to add the new header\

    let headers = req.headers;

    // const token: string;
    const token = localStorage.getItem('token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const cloneReq = req.clone({ headers });
    // Pass the cloned request instead of the original request to the next handle
    return next.handle(cloneReq);
  }
}
