import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersData, OrdersModules } from './orders.model';
import { SubSink } from 'subsink';
import { of } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { IPaginationData } from 'src/app/components/index-table/index-table.model';
import {
  FilterDataType,
  IEditMode,
  IFilter,
  ITab,
} from 'src/app/components/index-filters/index-filters.model';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  extra: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, extra: 'test', name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, extra: 'test', name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, extra: 'test', name: 'Lithium', weight: 6.941, symbol: 'Li' },
  {
    position: 4,
    extra: 'test',
    name: 'Beryllium',
    weight: 9.0122,
    symbol: 'Be',
  },
  { position: 5, extra: 'test', name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, extra: 'test', name: 'Carbon', weight: 12.0107, symbol: 'C' },
  {
    position: 7,
    extra: 'test',
    name: 'Nitrogen',
    weight: 14.0067,
    symbol: 'N',
  },
  { position: 8, extra: 'test', name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  {
    position: 9,
    extra: 'test',
    name: 'Fluorine',
    weight: 18.9984,
    symbol: 'F',
  },
  { position: 10, extra: 'test', name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, OrdersModules],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  displayedColumns = [
    { name: 'select', canHide: false, visible: true },
    { name: 'name', canHide: false, visible: true },
    { name: 'weight', canHide: true, visible: true },
    { name: 'symbol', canHide: true, visible: true },
    { name: 'position', canHide: true, visible: false },
  ];

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
  elementData: PeriodicElement[] = [];
  queryParams: ITab['filters'] = {};
  filtersData: FilterDataType | null = null;
  searchText = '';
  objectvalues = Object.values;
  currentTab = 0;

  ngOnInit(): void {
    this.getOrderFilters();
    this.getOrderData();
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
    this.subs.sink = of(ELEMENT_DATA).subscribe((data) => {
      this.elementData = data;
      this.pagination = {
        ...this.pagination,
        length: 100,
        pageSize: 30,
        currentPage: 1,
      };
    });
  }

  enableEdit(evt: IEditMode) {
    const { editMode, action } = evt;
    switch (action) {
      case 'edit':
        this.displayColumnsDump = JSON.parse(
          JSON.stringify(this.displayedColumns),
        );
        break;

      case 'save':
        this.tabs[this.currentTab].columns = this.displayedColumns
          .filter((c) => c.visible)
          .map((c) => c.name);

        break;

      case 'cancel':
        if (this.displayColumnsDump) {
          this.displayedColumns = this.displayColumnsDump;
        }
        break;

      default:
        break;
    }
    this.enableEditMode = editMode;
  }

  handlePageEvent(evt: PageEvent) {
    console.log('🚀 ~ handlePageEvent ~ evt:', evt);
    // handle pagination logic
  }

  onTabChange(tabIndex: number) {
    console.log('🚀 ~ onTabChange ~ tabIndex:', tabIndex);
    this.currentTab = tabIndex;
    const tabData = this.tabs[tabIndex];

    if (tabData) {
      const mapped = this.displayedColumns.map((col) => {
        const nameExist = tabData.columns.includes(col.name);
        if (col.canHide) {
          col.visible = nameExist;
        }
        return col;
      });
      this.displayedColumns = mapped;
    }

    // Call API with filters
    console.log('Calling API');
  }

  onChangeFilters(filter: IFilter | string | undefined) {
    if (filter === undefined) {
      // clear all case
      this.queryParams = {};
    } else if (typeof filter === 'string') {
      this.queryParams['query'] = this.searchText;
    } else {
      const { name, value } = filter;
      this.queryParams[name] = value.map((v) => v.value);
    }
  }

  onSaveFilters() {
    this.tabs[this.currentTab].filters = this.queryParams;
    this.onTabChange(this.currentTab);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
