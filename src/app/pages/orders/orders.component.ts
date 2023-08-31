import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersData, OrdersModules, RESP } from './orders.model';
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
  private subs = new SubSink();
  columns = [
    { name: 'select', canHide: false, visible: true },
    { name: 'Order Details', canHide: false, visible: true },
    { name: 'Customer details', canHide: true, visible: true },
    { name: 'Product Details', canHide: true, visible: true },
    { name: 'Payment', canHide: true, visible: true },
    { name: 'Order Statuses', canHide: true, visible: true },
    { name: 'Fulfilled By', canHide: true, visible: true },
    { name: 'Export', canHide: true, visible: true },
  ];

  displayedColumns = this.getColumnArrangement();

  tabs: ITab[] = [
    {
      name: 'All',
      filters: {},
      canUpdate: false,
      columns: ['select', 'name', 'weight', 'symbol', 'position'],
    },
    {
      name: 'Unpaid',
      filters: { statuses: [1], query: 'h' },
      canUpdate: true,
      columns: ['select', 'name', 'position'],
    },
    {
      name: 'Open',
      filters: {},
      canUpdate: true,
      columns: ['select', 'name', 'weight', 'position'],
    },
    {
      name: 'Closed',
      filters: {},
      canUpdate: true,
      columns: ['select', 'name', 'symbol', 'position'],
    },
    {
      name: 'Local delivery',
      filters: {},
      canUpdate: true,
      columns: ['select', 'name', 'weight', 'symbol'],
    },
    {
      name: 'Local pickup',
      filters: {},
      canUpdate: true,
      columns: ['select', 'weight', 'symbol', 'position'],
    },
  ];
  pagination: IPaginationData = {
    pageSizeOptions: [15, 30, 60],
    length: 100,
    pageSize: 15,
    currentPage: 0,
  };
  enableEditMode = false;
  displayColumnsDump: typeof this.displayedColumns | null = null;
  elementData = [];
  queryParams: ITab['filters'] = {};
  filtersData: FilterDataType | null = null;
  searchText = '';
  objectvalues = Object.values;
  currentTab = 0;
  disableSort = true;
  dataSource: MatTableDataSource<never[]> = new MatTableDataSource(undefined);
  selection = new SelectionModel<never[]>(true, []);
  @ViewChild('sort') sort!: MatSort;

  ngOnInit(): void {
    this.getOrderFilters();
    this.getOrderData();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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
      this.filtersData = FiltersData;
      this.filtersData['statuses'].data = [
        {
          value: 1,
          display: 'New',
        },
        {
          value: 2,
          display: 'Invoiced',
        },
      ];
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
