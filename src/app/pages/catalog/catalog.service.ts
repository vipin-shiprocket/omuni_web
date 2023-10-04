import { Injectable, inject } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ListingResponse, UpdateStatusResponse } from './catalog.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private http = inject(HttpService);

  getListings(body: Record<string, unknown>) {
    const endpoint = 'suchi/master-catalog/fetch';
    const headers = this.http.getHeaders({
      'X-Tenant-ID': '', //TODO
      'X-Channel': '', //TODO
    });

    return this.http.postToEndpint<ListingResponse>(
      endpoint,
      body,
      {},
      headers,
    );
  }

  updateStatus(params: Record<string, unknown>, body: Record<string, unknown>) {
    const endpoint = 'suchi/master-catalog';
    const headers = this.http.getHeaders({
      'X-Tenant-ID': '', //TODO
    });

    return this.http.putToEndpint<UpdateStatusResponse>(
      endpoint,
      body,
      params,
      headers,
    );
  }
}
