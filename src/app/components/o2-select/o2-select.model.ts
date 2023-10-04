import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CdkListboxModule } from '@angular/cdk/listbox';
import { OverlayModule } from '@angular/cdk/overlay';

export const O2SelectModules = [
  FormsModule,
  CdkListboxModule,
  OverlayModule,
  MatIconModule,
];

export interface IOption {
  display: string;
  disable?: boolean;
  value: string | number | boolean;
}

export type chipSelectboxType = 'select' | 'radio';
