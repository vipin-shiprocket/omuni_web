import { Component, OnDestroy, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/services/http.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-bulk-order',
  templateUrl: './bulk-order.component.html',
  styleUrls: ['./bulk-order.component.scss'],
})
export class BulkOrderComponent implements OnDestroy {
  private subs = new SubSink();
  private toastr = inject(ToastrService);
  private http = inject(HttpService);
  fileTypes =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, text/csv';

  onDrop(event: DragEvent) {
    event.preventDefault();
    const files = event.dataTransfer?.files ?? null;
    this.onFileChange(files);
  }

  onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    this.onFileChange(files);
    target.value = '';
  }

  private onFileChange(files: FileList | null) {
    if (!files?.length) return;

    const file = files[0];
    if (!this.fileTypes.includes(file.type)) {
      this.toastr.error('Not a valid file', 'Error');
      return;
    }

    const endpoint = '';
    const formData = new FormData();
    formData.append('csv', file);
    this.subs.sink = this.http
      .postToEndpint<unknown>(endpoint, formData)
      .subscribe({
        next: (value) => {
          console.log('🚀 ~ .subscribe ~ value:', value);
        },
        error: console.error,
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
