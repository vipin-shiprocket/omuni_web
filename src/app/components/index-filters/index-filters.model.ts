import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ChipSelectboxComponent } from '../chip-selectbox/chip-selectbox.component';
import { MatMenuModule } from '@angular/material/menu';
import { IOption } from '../chip-selectbox/chip-selectbox.model';

export const IndexFiltersModules = [
  FormsModule,
  RouterModule,
  MatDialogModule,
  MatButtonModule,
  MatIconModule,
  MatChipsModule,
  ChipSelectboxComponent,
  MatMenuModule,
];

export interface IFilter {
  name: string;
  label: string;
  type: 'select' | 'radio' | 'checkbox';
  multiple?: boolean;
  placement?: 'out' | 'in';
  placeholder?: string;
  value: IOption[];
  data: IOption[];
}

export type FilterDataType = Record<string, IFilter>;
export interface IEditMode {
  editMode: boolean;
  action?: 'edit' | 'save' | 'cancel';
}

export interface ITab {
  name: string;
  filters: Record<string, string | (string | number | boolean)[]>;
  canUpdate: boolean;
  columns: string[];
  dropdown?: boolean;
}
