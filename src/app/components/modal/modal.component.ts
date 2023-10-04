import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

const themeMap = {
  primary: 'bg-primary-subtle',
  secondary: 'bg-secondary-subtle',
  success: 'bg-success-subtle',
  info: 'bg-info-subtle',
  warning: 'bg-warning-subtle',
  danger: 'bg-danger-subtle',
  light: 'bg-light-subtle',
  dark: 'bg-dark-subtle',
} as const;

export interface IModal {
  type?: keyof typeof themeMap;
  title?: string;
  heading?: string;
  subheading?: string;
  buttons?: [{ name: string; url: string; class?: string }];
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, RouterModule, MatButtonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  theme = themeMap;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IModal,
  ) {}
}
