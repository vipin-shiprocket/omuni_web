import { SelectionModel } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  selection = new SelectionModel<never[]>(true, []);

  constructor(private http: HttpService) {}

  handoverManifest(ids: string[]) {
    const endpoint = '';
    return this.http.postToEndpint(endpoint, ids);
  }

  completeManifest(ids: string[]) {
    const endpoint = '';
    return this.http.postToEndpint(endpoint, ids);
  }

  deleteManifest(ids: string[]) {
    const endpoint = '';
    return this.http.postToEndpint(endpoint, ids);
  }
}
