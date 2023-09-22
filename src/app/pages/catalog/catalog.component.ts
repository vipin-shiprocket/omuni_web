import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CatalogService } from './catalog.service';
import * as Model from './catalog.model';
import { isEmptyObject } from 'src/app/utils/utils';
import { ITab } from 'src/app/components/index-filters/index-filters.model';
import { TablePlaceholder } from '../inventory/inventory.model';
import { MatTableDataSource } from '@angular/material/table';
import { IPaginationData } from 'src/app/components/index-table/index-table.model';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { SubSink } from 'subsink';
import { CustomPaginator } from 'src/app/utils/customPaginator';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: Model.CatalogModules,
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginator }],
})
export class CatalogComponent implements OnDestroy, OnInit {
  activeTabIdx = 0;
  columnsToDisplay = Model.CatalogColumns.map((val) => val.name);
  dataSource: MatTableDataSource<never[]> = new MatTableDataSource(
    TablePlaceholder,
  );
  filters: Record<string, unknown> = {};
  pagination: IPaginationData = {
    pageSizeOptions: [25, 50, 100],
    length: 7,
    pageSize: 25,
    currentPage: 0,
  };
  sortBy = Model.SortBy;
  subs = new SubSink();
  tabs: ITab[] = Model.CatalogTabs as ITab[];
  private catalogService = inject(CatalogService);

  ngOnInit(): void {
    this.getCatalogData();
  }

  getCatalogData() {
    this.dataSource.data = TablePlaceholder;

    const body = {
      pageNumber: this.pagination.currentPage,
      pageSize: this.pagination.pageSize,
      fieldsRequired: Model.RequiredFields,
      filters: this.filters,
    };

    this.subs.sink = this.catalogService.getListings(body).subscribe({
      next: (data) => {
        this.dataSource.data = data.data.masterCatalog as never;
        this.pagination = {
          ...this.pagination,
          length: data.hasNext ? 999 : data.data.masterCatalog.length,
        };
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  isEmpty = isEmptyObject;

  handlePageEvent(event: PageEvent) {
    this.pagination.currentPage = event.pageIndex;
    this.pagination.pageSize = event.pageSize;
    this.getCatalogData();
  }

  onTabClick(tabIdx: number) {
    this.activeTabIdx = tabIdx;
    delete this.filters['isActive'];
    delete this.filters['isCombo'];
    switch (this.tabs[this.activeTabIdx].name) {
      case 'Active':
        this.filters['isActive'] = ['true'];
        break;
      case 'Inactive':
        this.filters['isActive'] = ['false'];
        break;
      case 'Combos':
        this.filters['isCombo'] = true;
        break;
      default:
        break;
    }
    this.getCatalogData();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
