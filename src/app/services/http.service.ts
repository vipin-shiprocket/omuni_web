import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { AppConstants } from 'src/app/utils/config';

type Tparam = string | number | boolean;
type Theader = string | number | (string | number)[];

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private httpClient: HttpClient) {}

  getQueryParam(paramsObj: Record<string, Tparam>): HttpParams {
    let params = new HttpParams();
    for (const key in paramsObj) {
      params = params.set(key, paramsObj[key]);
    }
    return params;
  }

  getHeaders(newHeaders?: Record<string, Theader>): HttpHeaders {
    let headers;
    if (newHeaders) {
      headers = new HttpHeaders(newHeaders);
    } else {
      headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      });
    }

    return headers;
  }

  requestToEndpoint<T>(endpoint: string, params = {}, headers?: HttpHeaders) {
    params = this.getQueryParam(params);
    const url = `${environment.API_URL}/${endpoint}`;
    return this.httpClient.get(url, { params, headers }) as Observable<T>;
  }

  postToEndpint<T>(
    endpoint: string,
    body: unknown,
    params = {},
    headers?: HttpHeaders,
  ) {
    const url = `${environment.API_URL}/${endpoint}`;
    // const url = `${window.location.origin}/api/auth${endpoint}`;

    params = this.getQueryParam(params);
    return this.httpClient.post(url, body, {
      params,
      headers,
    }) as Observable<T>;
  }

  putToEndpint<T>(
    endpoint: string,
    body: unknown,
    params = {},
    headers?: HttpHeaders,
    observe: 'body' | undefined = 'body',
  ) {
    const url = `${environment.API_URL}/${endpoint}`;

    params = this.getQueryParam(params);
    return this.httpClient.put(url, body, {
      headers,
      params,
      observe,
    }) as Observable<T>;
  }

  deleteRequest<T>(endpoint: string) {
    const url = `${window.location.origin}/api/auth${endpoint}`;
    return this.httpClient.delete(url) as Observable<T>;
  }

  putToUrl<T>(
    url: string,
    body: unknown,
    params = {},
    headers?: HttpHeaders,
    observe: 'body' | undefined = 'body',
  ) {
    params = this.getQueryParam(params);
    return this.httpClient.put(url, body, {
      params,
      headers,
      observe,
    }) as Observable<T>;
  }

  requestByUrl<T>(url: string, params = {}, headers?: HttpHeaders) {
    params = this.getQueryParam(params);
    return this.httpClient.get(url, { params, headers }) as Observable<T>;
  }

  postByUrl<T>(url: string, body: unknown, params = {}, headers?: HttpHeaders) {
    params = this.getQueryParam(params);
    return this.httpClient.post(url, body, {
      params,
      headers,
    }) as Observable<T>;
  }
}
