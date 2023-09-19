import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { InventoryService } from './inventory.service';
import { checkWindowWidth, verifyFileType } from 'src/app/utils/utils';
import { ToastrService } from 'ngx-toastr';
import { SubSink } from 'subsink';
import {
  ActionDropdownPositions,
  AnalyticsResponse,
  ErrorResponse,
  FileUpdateOptions,
  FiltersData,
  InventoryColumns,
  InventoryModules,
  InventoryUpdateOptions,
  TablePlaceholder,
  analytics,
} from './inventory.model';
import { NgForm } from '@angular/forms';
import { Subject, switchMap } from 'rxjs';
import { ITab } from 'src/app/components/index-filters/index-filters.model';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { IPaginationData } from 'src/app/components/index-table/index-table.model';
import { MatTableDataSource } from '@angular/material/table';
import { CustomPaginator } from 'src/app/utils/customPaginator';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: InventoryModules,
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }],
})
export class InventoryComponent implements OnInit, OnDestroy {
  fileOptions = FileUpdateOptions;
  activeTabIdx = 0;
  analyticsData?: AnalyticsResponse['data'];
  analyticsStructure = analytics;
  columns = InventoryColumns;
  columnsToDisplay = [...this.getColumnArrangement()];
  filtersData = FiltersData;
  dataSource: MatTableDataSource<never[]> = new MatTableDataSource(
    TablePlaceholder,
  );
  dropDownClose = new Subject<void>();
  dropDownPositions = ActionDropdownPositions;
  overWriteOptions = InventoryUpdateOptions;
  pagination: IPaginationData = {
    pageSizeOptions: [25, 50, 100],
    length: 7,
    pageSize: 25,
    currentPage: 0,
  };
  selectedFileInput!: EventTarget | null;
  selectedOption!: string[];
  sortBy = ['name'];
  tabs: ITab[] = [];
  tempQty?: number;
  private inventoryService = inject(InventoryService);
  private toast = inject(ToastrService);
  private subs = new SubSink();
  fileTypes =
    '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel';

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

  getAnalyticsData() {
    this.analyticsData = undefined;
    const params = { fcId: '' };
    this.subs.sink = this.inventoryService.getAnalytics(params).subscribe({
      next: (data: AnalyticsResponse) => {
        this.analyticsData = data.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getInventoryData(evt?: string[]) {
    if (evt) this.sortBy = evt;

    this.dataSource.data = TablePlaceholder;

    this.getAnalyticsData();

    const params = {
      sortField: this.sortBy[0],
      pageNum: this.pagination.currentPage,
      pageSize: this.pagination.pageSize,
      fcId: 'FC_123',
      viewId: 'VIEW_123',
    };

    this.subs.sink = this.inventoryService.getListings(params).subscribe({
      next: (data) => {
        this.dataSource.data = data.data as never;
        this.pagination = {
          ...this.pagination,
          length: data.hasNext ? 999 : data.data.length,
        };
      },
      error: (err) => {
        console.log(err);
      },
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

  closeUpdateDropdown() {
    this.tempQty = undefined;
    this.dropDownClose.next();
  }

  getColumnArrangement() {
    return this.columns
      .filter((d) => !d.canHide || d.visible)
      .map((d) => d.name)
      .slice();
  }

  handlePageEvent(event: PageEvent) {
    this.pagination.currentPage = event.pageIndex;
    this.pagination.pageSize = event.pageSize;
    this.getInventoryData();
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

  filterChanged(evt: Record<string, unknown>[]) {
    if (!evt[0]) return;
    const cols = evt[0]['columns'] as string[];
    this.columns.map((columnData) => {
      columnData.visible = cols.includes(columnData.name);
    });
    this.columnsToDisplay = [...this.getColumnArrangement()];
    this.getInventoryData();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
