import { Component, inject } from '@angular/core';
import { CatalogService } from './catalog.service';
import {
  CatalogColumns,
  CatalogModules,
  CatalogTabs,
  SortBy,
} from './catalog.model';
import { checkWindowWidth, isEmptyObject } from 'src/app/utils/utils';
import { ITab } from 'src/app/components/index-filters/index-filters.model';
import { TablePlaceholder } from '../inventory/inventory.model';
import { MatTableDataSource } from '@angular/material/table';
import { IPaginationData } from 'src/app/components/index-table/index-table.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: CatalogModules,
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent {
  activeTabIdx = 0;
  columnsToDisplay = CatalogColumns.map((val) => val.name);
  dataSource: MatTableDataSource<never[]> = new MatTableDataSource(
    TablePlaceholder,
  );
  pagination: IPaginationData = {
    pageSizeOptions: [25, 50, 100],
    length: 7,
    pageSize: 25,
    currentPage: 0,
  };
  sortBy = SortBy;
  tabs: ITab[] = CatalogTabs as ITab[];
  private catalogService = inject(CatalogService);

  get showSearch() {
    return checkWindowWidth();
  }

  addDropdownAttrFlag(tabIndex: number) {
    this.tabs.forEach((tab, i) => {
      tab.dropdown = tabIndex === i;
    });
  }

  isEmpty = isEmptyObject;

  handlePageEvent(event: PageEvent) {
    this.pagination.currentPage = event.pageIndex;
    this.pagination.pageSize = event.pageSize;
    // this.getCatalogData();
  }

  onTabClick(tabIdx: number) {
    if (tabIdx !== this.activeTabIdx) {
      setTimeout(() => {
        this.addDropdownAttrFlag(tabIdx);
      });
    }
    this.activeTabIdx = tabIdx;
    // this.getCatalogData();
  }
}
