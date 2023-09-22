import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FiltersComponent } from 'src/app/components/filters/filters.component';
import { GlobalSearchComponent } from 'src/app/components/global-search/global-search.component';
import { O2SelectComponent } from 'src/app/components/o2-select/o2-select.component';
import { DropdownRendererDirective } from 'src/app/directives/dropdown.directive';
import { MapperPipe } from 'src/app/pipes/mapper.pipe';

export const CatalogModules = [
  CdkTableModule,
  CommonModule,
  DropdownRendererDirective,
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

export const CatalogTabs = [
  {
    name: 'All',
    filters: {},
  },
  {
    name: 'Active',
    filters: { statuses: [1], query: 'h' },
  },
  {
    name: 'Inactive',
    filters: {},
  },
  {
    name: 'Combos',
    filters: {},
  },
];

export const CatalogColumns = [
  { name: 'sku', canHide: false, visible: true },
  { name: 'name', canHide: false, visible: true },
  { name: 'category', canHide: false, visible: true },
  { name: 'tax', canHide: false, visible: true },
  { name: 'hsn', canHide: false, visible: true },
  { name: 'mrp', canHide: false, visible: true },
  { name: 'dimension', canHide: false, visible: true },
];

export const SortBy = [
  {
    value: 'sku',
    display: 'Master SKU',
  },
  {
    value: 'name',
    display: 'Product Name',
  },
  {
    value: 'category',
    display: 'Category',
  },
  {
    value: 'tax',
    display: 'Tax',
  },
  {
    value: 'hsn',
    display: 'HSN',
  },
  {
    value: 'mrp',
    display: 'MRP',
  },
];
