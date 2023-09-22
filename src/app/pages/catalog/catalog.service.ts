import { Injectable, inject } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { ListingResponse } from './catalog.model';

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
}
