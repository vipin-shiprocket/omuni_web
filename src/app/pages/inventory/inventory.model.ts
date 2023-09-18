import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { O2SelectComponent } from 'src/app/components/o2-select/o2-select.component';
import { GlobalSearchComponent } from '../../components/global-search/global-search.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MapperPipe } from 'src/app/pipes/mapper.pipe';
import { FiltersComponent } from 'src/app/components/filters/filters.component';
import { FilterDataType } from 'src/app/components/index-filters/index-filters.model';

// ---------Temp-------------
export const InventoryTabs = [
  {
    name: 'All',
    filters: {},
    canUpdate: false,
    columns: ['name', 'sku', 'available', 'blocked', 'total', 'action'],
  },
];

export const analyticsResponse: Record<
  string,
  Record<'quantity' | 'percentage', number>
> = {
  totalInventory: {
    quantity: 25,
    percentage: 167,
  },
  totalSku: {
    quantity: 12,
    percentage: -149,
  },
  totalOutOfStockSku: {
    quantity: 43,
    percentage: 51,
  },
  totalBlockedSku: {
    quantity: 67,
    percentage: -100,
  },
  totalAvailableSku: {
    quantity: 2,
    percentage: 65,
  },
};

// --------------------------
export const InventoryModules = [
  CdkTableModule,
  CommonModule,
  FiltersComponent,
  FormsModule,
  GlobalSearchComponent,
  MapperPipe,
  MatIconModule,
  MatPaginatorModule,
  MatTooltipModule,
  NgOptimizedImage,
  O2SelectComponent,
];

export type ErrorResponse = Record<'data', string>;

export type ListingResponse = {
  data: {
    sku: string;
    productDetails: {
      name: string;
      image: string;
      size: number;
      colour: string;
    };
    totalQuantity: number;
    blockedQuantity: number;
    availableQuantity: number;
    showImage?: boolean;
  }[];
  hasNext: boolean;
};

export type FileType = 'RESET' | 'DELTA';

export type FileUploadResponse = {
  fileName: string;
  fileType: FileType;
  preSignedUrl: string;
};

export type S3UploadResponse = {
  [string: string]: string | unknown;
  etag: string;
};

export type AcknowledgeUploadResponse = {
  checksum: string;
  fileName: string;
  fileType: FileType;
  preSignedUrl: string;
  status: boolean;
};

export type UpdateInventoryBody = {
  ean: string;
  fcId: string;
  quantity: string;
  transactionType: 'CREDIT' | 'DEBIT' | 'OVERWRITE';
};

export type AnalyticsResponse = Record<
  string,
  Record<'quantity' | 'percentage', number>
>;

export const analytics = [
  {
    name: 'Total Inventory',
    image: 'assets/images/inventory/inventoryTotal.svg',
    key: 'totalInventory',
  },
  {
    name: 'Total count of SKUs',
    image: 'assets/images/inventory/inventorySKUCount.svg',
    key: 'totalSku',
  },
  {
    name: 'Out of stock SKUs',
    image: 'assets/images/inventory/inventoryOut.svg',
    key: 'totalOutOfStockSku',
  },
  {
    name: 'Blocked',
    image: 'assets/images/inventory/inventoryBlocked.svg',
    key: 'totalBlockedSku',
  },
  {
    name: 'Available',
    image: 'assets/images/inventory/inventoryAvailable.svg',
    key: 'totalAvailableSku',
  },
];

export const FiltersData: FilterDataType = {
  columns: {
    name: 'columns',
    label: 'Column',
    type: 'select',
    placement: 'out',
    multiple: true,
    value: ['name', 'sku', 'available', 'blocked', 'total'],
    data: [
      {
        value: 'name',
        display: 'Product Name',
      },
      {
        value: 'sku',
        display: 'SKU',
      },
      {
        value: 'available',
        display: 'Available',
      },
      {
        value: 'blocked',
        display: 'Blocked',
      },
      {
        value: 'total',
        display: 'Total Inventory',
      },
    ],
  },
};

export const InventoryColumns = [
  { name: 'name', canHide: false, visible: true },
  { name: 'sku', canHide: true, visible: true },
  { name: 'available', canHide: true, visible: true },
  { name: 'blocked', canHide: true, visible: true },
  { name: 'total', canHide: true, visible: true },
  { name: 'Actions', canHide: false, visible: true },
];

export const TablePlaceholder = [
  {} as never[],
  {} as never[],
  {} as never[],
  {} as never[],
  {} as never[],
  {} as never[],
  {} as never[],
];
