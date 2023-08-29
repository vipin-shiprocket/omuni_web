import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CdkTableModule } from '@angular/cdk/table';

export const IndexTableModules = [
  CdkTableModule,
  FormsModule,
  MatIconModule,
  MatSortModule,
  MatCheckboxModule,
  MatPaginatorModule,
];

export interface IColumnData {
  name: string;
  canHide: boolean;
  visible: boolean;
}

/* eslint-disable-next-line */
export type LooseObject = Record<string, any>;

export interface IPaginationData {
  length: number;
  pageSizeOptions: number[];
  pageSize: number;
  currentPage: number;
}
