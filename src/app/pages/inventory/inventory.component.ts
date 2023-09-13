import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { InventoryService } from './inventory.service';
import { checkWindowWidth, verifyFileType } from 'src/app/utils/utils';
import { ToastrService } from 'ngx-toastr';
import { SubSink } from 'subsink';
import { ErrorResponse, InventoryTabs, analytics } from './inventory.model';
import { O2SelectComponent } from 'src/app/components/o2-select/o2-select.component';
import { IOption } from 'src/app/components/chip-selectbox/chip-selectbox.model';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, switchMap } from 'rxjs';
import { ITab } from 'src/app/components/index-filters/index-filters.model';
import { GlobalSearchComponent } from 'src/app/components/global-search/global-search.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    GlobalSearchComponent,
    NgOptimizedImage,
    O2SelectComponent,
  ],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnDestroy {
  fileOptions: IOption[] = [
    { display: 'Reset', value: 'RESET' },
    { display: 'Delta', value: 'DELTA' },
  ];
  activeTabIdx = 0;
  analyticsStructure = analytics;
  tabs: ITab[] = InventoryTabs;
  selectedFileInput!: EventTarget | null;
  selectedOption!: string[];
  private _analyticsResponse$?: Observable<
    Record<
      string,
      {
        amount: number;
        direction: string;
      }
    >
  >;
  private inventoryService = inject(InventoryService);
  private toast = inject(ToastrService);
  private subs = new SubSink();
  fileTypes =
    '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

  get analyticsResponse$(): Observable<
    Record<
      string,
      {
        amount: number;
        direction: string;
      }
    >
  > {
    if (!this._analyticsResponse$) {
      this._analyticsResponse$ = this.inventoryService.getAnalytics();
    }
    return this._analyticsResponse$;
  }

  get getOption() {
    return this.selectedOption[0];
  }

  get selectedFile() {
    const files = (this.selectedFileInput as HTMLInputElement)?.files ?? null;
    return files ? files[0] : null;
  }

  get showSearch() {
    return checkWindowWidth();
  }

  getInventoryData() {
    return;
  }

  addDropdownAttrFlag(tabIndex: number) {
    this.tabs.forEach((tab, i) => {
      tab.dropdown = tabIndex === i;
    });
  }

  onTabClick(tabIdx: number) {
    if (tabIdx !== this.activeTabIdx) {
      setTimeout(() => {
        this.addDropdownAttrFlag(tabIdx);
      });
    }
    this.activeTabIdx = tabIdx;
    this.getInventoryData();
  }

  uploadFile(form: NgForm) {
    if (!this.selectedFile) {
      this.toast.warning('No file selected');
      return;
    }

    const isValidType = verifyFileType(
      this.selectedFile,
      this.fileTypes.split(','),
    );
    if (!isValidType) {
      this.toast.warning(
        'Only select files of type csv, xls or xslx',
        'Invalid file type!',
      );
      return;
    }

    this.subs.sink = this.inventoryService
      .getPreSignedUrlForUpload(this.selectedFile.name, this.getOption)
      .pipe(
        switchMap((resp) => {
          if (!resp.preSignedUrl || !this.selectedFile) {
            throw new Error('Something went wrong...');
          }
          return this.inventoryService.uploadFile(
            resp.preSignedUrl,
            this.selectedFile,
          );
        }),
        switchMap((resp) => {
          const checksum = resp.headers.get('ETag')?.replaceAll('"', '');
          if (!checksum || !this.selectedFile) {
            throw new Error('Something went wrong...');
          }
          return this.inventoryService.acknowledgeUpload(
            checksum,
            this.selectedFile.name,
            this.getOption,
          );
        }),
      )
      .subscribe({
        next: (data) => {
          if (data.status) {
            this.toast.success('Upload successful');
            (this.selectedFileInput as HTMLInputElement).value = '';
            form.resetForm();
          }
        },
        error: (err: ErrorResponse) => {
          console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
