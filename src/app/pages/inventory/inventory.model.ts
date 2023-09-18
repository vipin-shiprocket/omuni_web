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

export const RESP = {
  data: [
    {
      name: 'TITANIUM DIOXIDE, OCTINOXATE, OXYBENZONE',
      sku: '01HAA3QM3G2YDSZXH7MVTK9BRC',
      available: 14,
      blocked: 94,
      total: 99,
    },
    {
      name: 'ALCOHOL',
      sku: '01HAA3QM3GXWEKSQD43QVZ9V7Y',
      available: 8,
      blocked: 36,
      total: 4,
    },
    {
      name: 'Acetaminophen and Diphenhydramine Citrate',
      sku: '01HAA3QM3H0WYXVHWF15CHXVZK',
      available: 22,
      blocked: 67,
      total: 10,
    },
    {
      name: 'Elm, American Ulmus americana',
      sku: '01HAA3QM3HY5FQ0ZA32Q10JXWR',
      available: 43,
      blocked: 49,
      total: 67,
    },
    {
      name: 'Octinoxate and Oxybenzone',
      sku: '01HAA3QM3J23RMGEAM0ZEGEG3B',
      available: 66,
      blocked: 6,
      total: 13,
    },
    {
      name: 'ZINC OXIDE, TITANIUM DIOXIDE',
      sku: '01HAA3QM3JNK88JMR5WCEGT0KE',
      available: 3,
      blocked: 40,
      total: 39,
    },
    {
      name: 'Galantamine',
      sku: '01HAA3QM3K62VSSASGQV65KRGK',
      available: 42,
      blocked: 87,
      total: 23,
    },
    {
      name: 'PredniSONE',
      sku: '01HAA3QM3K6712VBMBARC5CEDC',
      available: 12,
      blocked: 4,
      total: 46,
    },
    {
      name: 'Lisinopril',
      sku: '01HAA3QM3M1ZWW9VW8ANH9NMZN',
      available: 62,
      blocked: 74,
      total: 63,
    },
    {
      name: 'MISOPROSTOL',
      sku: '01HAA3QM3MDNCPQCQZC3ZJYY45',
      available: 25,
      blocked: 5,
      total: 91,
    },
    {
      name: 'dimethicone, octinoxate, octisalate, oxybenzone',
      sku: '01HAA3QM3NSF1TPC4P8492KDN3',
      available: 61,
      blocked: 65,
      total: 89,
    },
    {
      name: 'Estradiol and Norethindrone Acetate',
      sku: '01HAA3QM3NW84B3KRPGD8CP2ZT',
      available: 33,
      blocked: 17,
      total: 94,
    },
    {
      name: 'Bisacodyl',
      sku: '01HAA3QM3NXCG7METPCW0QC4DB',
      available: 86,
      blocked: 43,
      total: 11,
    },
    {
      name: 'Phoma betae',
      sku: '01HAA3QM3P3F4JZN6HCFBMEJ3J',
      available: 33,
      blocked: 93,
      total: 63,
    },
    {
      name: 'Arnica montana, Avena sativa, Damiana, DNA, Korean Ginseng, Oleum animale, Pituitaria glandula (bovine), RNA, Thuja occidentalis,',
      sku: '01HAA3QM3PS3CK7GZG1TT05Q3Z',
      available: 53,
      blocked: 62,
      total: 76,
    },
    {
      name: 'Acetaminophen',
      sku: '01HAA3QM3QTPATHE0BY23SMJVX',
      available: 51,
      blocked: 7,
      total: 32,
    },
    {
      name: 'ESTRADIOL VALERATE',
      sku: '01HAA3QM3REVSZMB12ZGPHGN93',
      available: 92,
      blocked: 1,
      total: 78,
    },
    {
      name: 'Homosalate, Octisalate, Oxybenzone, Avobenzone, Octinoxate and Octocrylene',
      sku: '01HAA3QM3R532FT7JP7VD0TW41',
      available: 3,
      blocked: 10,
      total: 24,
    },
    {
      name: 'NITROGLYCERIN',
      sku: '01HAA3QM3R0J6ME5F63BMA301N',
      available: 99,
      blocked: 87,
      total: 2,
    },
    {
      name: 'Octinoxate and Titanium dioxide',
      sku: '01HAA3QM3S93TGJKG4VMPG56EH',
      available: 20,
      blocked: 75,
      total: 93,
    },
    {
      name: 'SACCHAROMYCES CEREVISIAE',
      sku: '01HAA3QM3SA0AA2DHR9DVYT7N3',
      available: 90,
      blocked: 34,
      total: 80,
    },
    {
      name: 'Bacitracin Zinc, Neomycin Sulfate, and Polymyxin B Sulfate',
      sku: '01HAA3QM3TE54G8QE1NZMATC4J',
      available: 10,
      blocked: 60,
      total: 95,
    },
    {
      name: 'Montelukast Sodium',
      sku: '01HAA3QM3TKJJM7KKSVPWPXBM3',
      available: 36,
      blocked: 45,
      total: 12,
    },
    {
      name: 'Lycopodium Clavatum',
      sku: '01HAA3QM3VQ94PA0G04KAYDDF3',
      available: 7,
      blocked: 9,
      total: 16,
    },
    {
      name: 'Oxygen',
      sku: '01HAA3QM3V8SEMPXSVFGP3T830',
      available: 53,
      blocked: 24,
      total: 32,
    },
  ],
  next: true,
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
