import { CdkListboxModule } from '@angular/cdk/listbox';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

export const ChipSelectBoxModules = [
  FormsModule,
  CdkListboxModule,
  OverlayModule,
  MatIconModule,
  MatChipsModule,
];

export interface IOption {
  display: string;
  value: string | number | boolean;
}

export type chipSelectboxType = 'select' | 'radio';
