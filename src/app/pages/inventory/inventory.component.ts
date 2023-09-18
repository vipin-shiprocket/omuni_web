import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { InventoryService } from './inventory.service';
import { checkWindowWidth, verifyFileType } from 'src/app/utils/utils';
import { ToastrService } from 'ngx-toastr';
import { SubSink } from 'subsink';
import {
  ErrorResponse,
  FiltersData,
  InventoryColumns,
  InventoryModules,
  RESP,
  TablePlaceholder,
  analytics,
} from './inventory.model';
import { IOption } from 'src/app/components/chip-selectbox/chip-selectbox.model';
import { NgForm } from '@angular/forms';
import { Observable, delay, of, switchMap } from 'rxjs';
import { ITab } from 'src/app/components/index-filters/index-filters.model';
import { PageEvent } from '@angular/material/paginator';
import { IPaginationData } from 'src/app/components/index-table/index-table.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: InventoryModules,
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit, OnDestroy {
  fileOptions: IOption[] = [
    { display: 'Reset', value: 'RESET' },
    { display: 'Delta', value: 'DELTA' },
  ];
  activeTabIdx = 0;
  analyticsStructure = analytics;
  columns = InventoryColumns;
  columnsToDisplay = [...this.getColumnArrangement()];
  filtersData = FiltersData;
  dataSource: MatTableDataSource<never[]> = new MatTableDataSource(
    TablePlaceholder,
  );
  pagination: IPaginationData = {
    pageSizeOptions: [25, 50, 100],
    length: 5,
    pageSize: 25,
    currentPage: 0,
  };
  selectedFileInput!: EventTarget | null;
  selectedOption!: string[];
  tabs: ITab[] = [];
  private _analyticsResponse$?: Observable<
    Record<string, Record<'quantity' | 'percentage', number>>
  >;
  private inventoryService = inject(InventoryService);
  private toast = inject(ToastrService);
  private subs = new SubSink();
  fileTypes =
    '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

  get analyticsResponse$(): Observable<
    Record<string, Record<'quantity' | 'percentage', number>>
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

  ngOnInit(): void {
    this.getInventoryData();
    this.addDropdownAttrFlag(0);
  }

  getInventoryData() {
    this.subs.sink = of(RESP)
      .pipe(delay(2000))
      .subscribe((data) => {
        this.dataSource.data = data.data as never;
        this.pagination = {
          ...this.pagination,
          length: data.meta.pagination.total,
          pageSize: +data.meta.pagination.per_page,
          currentPage: data.meta.pagination.current_page,
        };
      });
  }

  abs(val: number) {
    return Math.abs(val);
  }

  addDropdownAttrFlag(tabIndex: number) {
    this.tabs.forEach((tab, i) => {
      tab.dropdown = tabIndex === i;
    });
  }

  getColumnArrangement() {
    return this.columns
      .filter((d) => d.visible)
      .map((d) => d.name)
      .slice();
  }

  handlePageEvent(event: PageEvent) {
    console.log(event);

    return;
  }

  isEmpty(obj: object) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
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
