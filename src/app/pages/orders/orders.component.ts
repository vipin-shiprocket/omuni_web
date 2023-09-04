import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FiltersData,
  OrderColumns,
  OrderTabs,
  OrdersModules,
  RESP,
} from './orders.model';
import { SubSink } from 'subsink';
import { of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { IPaginationData } from 'src/app/components/index-table/index-table.model';
import {
  FilterDataType,
  ITab,
} from 'src/app/components/index-filters/index-filters.model';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, OrdersModules],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sort') sort!: MatSort;
  private subs = new SubSink();
  columns = OrderColumns;
  displayedColumns = this.getColumnArrangement();
  tabs: ITab[] = OrderTabs as ITab[];
  enableEditMode = false;
  disableSort = true;
  activeTabIdx = 0;
  filtersData: FilterDataType | null = null;
  dataSource: MatTableDataSource<never[]> = new MatTableDataSource(undefined);
  selection = new SelectionModel<never[]>(true, []);
  pagination: IPaginationData = {
    pageSizeOptions: [15, 30, 60],
    length: 100,
    pageSize: 15,
    currentPage: 0,
  };

  ngOnInit(): void {
    this.getOrderFilters();
    this.getOrderData();
    this.addDropdownAttrFlag(0);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  addDropdownAttrFlag(tabIndex: number) {
    this.tabs.forEach((tab, i) => {
      tab.dropdown = tabIndex === i;
    });
  }

  isAllSelected() {
    const numSelected = this.selection?.selected?.length;
    const numRows = this.dataSource?.data?.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: never): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}
    row ${row['position'] + 1}`;
  }

  getColumnArrangement() {
    return this.columns
      .filter((d) => d.visible)
      .map((d) => d.name)
      .slice();
  }

  getOrderFilters() {
    this.subs.sink = of('filters are coming').subscribe(() => {
      FiltersData['statuses'].data = [
        {
          value: 'all',
          display: 'All',
        },
        {
          value: 1,
          display: 'New',
        },
        {
          value: 2,
          display: 'Invoiced',
        },
      ];
      this.filtersData = FiltersData;
    });
  }

  getOrderData() {
    this.subs.sink = of(RESP).subscribe((data) => {
      this.dataSource.data = data.data as never;
      this.pagination = {
        ...this.pagination,
        length: data.meta.pagination.total,
        pageSize: +data.meta.pagination.per_page,
        currentPage: data.meta.pagination.current_page,
      };
    });
  }

  onTabClick(tabIdx: number) {
    if (tabIdx !== this.activeTabIdx) {
      setTimeout(() => {
        this.addDropdownAttrFlag(tabIdx);
      });
    }
    this.activeTabIdx = tabIdx;
    this.getOrderData();
  }

  // enableEdit(evt: IEditMode) {
  //   const { editMode, action } = evt;
  //   switch (action) {
  //     case 'edit':
  //       this.displayColumnsDump = JSON.parse(
  //         JSON.stringify(this.displayedColumns),
  //       );
  //       break;

  //     case 'save':
  //       this.tabs[this.currentTab].columns = this.displayedColumns
  //         .filter((c) => c.visible)
  //         .map((c) => c.name);

  //       break;

  //     case 'cancel':
  //       if (this.displayColumnsDump) {
  //         this.displayedColumns = this.displayColumnsDump;
  //       }
  //       break;

  //     default:
  //       break;
  //   }
  //   this.enableEditMode = editMode;
  // }

  handlePageEvent(evt: PageEvent) {
    console.log('🚀 ~ handlePageEvent ~ evt:', evt);
    // handle pagination logic
  }

  // onTabChange(tabIndex: number) {
  //   console.log('🚀 ~ onTabChange ~ tabIndex:', tabIndex);
  //   this.currentTab = tabIndex;
  //   const tabData = this.tabs[tabIndex];

  //   if (tabData) {
  //     const mapped = this.displayedColumns.map((col) => {
  //       const nameExist = tabData.columns.includes(col.name);
  //       if (col.canHide) {
  //         col.visible = nameExist;
  //       }
  //       return col;
  //     });
  //     this.displayedColumns = mapped;
  //   }

  //   // Call API with filters
  //   console.log('Calling API');
  // }

  // onChangeFilters(filter: IFilter | string | undefined) {
  //   if (filter === undefined) {
  //     // clear all case
  //     this.queryParams = {};
  //   } else if (typeof filter === 'string') {
  //     this.queryParams['query'] = this.searchText;
  //   } else {
  //     const { name, value } = filter;
  //     this.queryParams[name] = value.map((v) => v.value);
  //   }
  // }

  // onSaveFilters() {
  //   this.tabs[this.currentTab].filters = this.queryParams;
  //   this.onTabChange(this.currentTab);
  // }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
