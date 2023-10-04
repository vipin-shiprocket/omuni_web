import { NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { O2SelectComponent } from '../o2-select/o2-select.component';
import { O2DaterangeComponent } from '../o2-daterange/o2-daterange.component';
import { MatChipsModule } from '@angular/material/chips';

export const FiltersModules = [
  MatChipsModule,
  MatIconModule,
  FormsModule,
  ReactiveFormsModule,
  NgOptimizedImage,
  O2SelectComponent,
  O2DaterangeComponent,
];
