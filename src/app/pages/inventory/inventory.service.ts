import { Injectable, inject } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import {
  AcknowledgeUploadResponse,
  FileUploadResponse,
  S3UploadResponse,
  UpdateInventoryBody,
  analyticsResponse,
} from './inventory.model';
import { HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private http = inject(HttpService);

  getAnalytics() {
    return of(analyticsResponse).pipe(delay(2000));
  }

  getPreSignedUrlForUpload(fileName: string, fileType: string) {
    const endpoint = 'narcos/file-upload/presigned-url';
    const headers = this.http.getHeaders({
      'X-Tenant-ID': '', //TODO
      'X-USER-ID': '', //TODO
    });
    const params = {
      fileName: fileName,
      fileType: fileType,
    };

    return this.http.requestToEndpoint<FileUploadResponse>(
      endpoint,
      params,
      headers,
    );
  }

  uploadFile(url: string, file: File) {
    return this.http.putToUrl<HttpResponse<S3UploadResponse>>(
      url,
      file,
      {},
      undefined,
      'response' as 'body',
    );
  }

  acknowledgeUpload(checksum: string, fileName: string, fileType: string) {
    const endpoint = 'narcos/file-upload/acknowledgment';
    const headers = this.http.getHeaders({
      'X-Tenant-ID': '', //TODO
      'X-USER-ID': '', //TODO
    });
    const body = {
      checksum: checksum,
      fileName: fileName,
      fileType: fileType,
    };

    return this.http.postToEndpint<AcknowledgeUploadResponse>(
      endpoint,
      body,
      {},
      headers,
    );
  }

  updateInventory(inventories: UpdateInventoryBody[], createdDateTime: string) {
    const endpoint = 'narcos/delta/inventory';
    const headers = this.http.getHeaders({
      'X-Tenant-ID': '', //TODO
      'X-USER-ID': '', //TODO
    });
    const body = {
      inventories: inventories,
      createdDateTime: createdDateTime,
    };

    return this.http.postToEndpint<AcknowledgeUploadResponse>(
      endpoint,
      body,
      {},
      headers,
    );
  }
}
