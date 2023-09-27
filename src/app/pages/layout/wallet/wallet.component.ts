import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DropdownRendererDirective } from 'src/app/directives/dropdown.directive';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RechargeComponent } from './recharge/recharge.component';
import { RechargeDialogData } from './wallet.model';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [
    CommonModule,
    DropdownRendererDirective,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
})
export class WalletComponent {
  @Input() isMobile = false;
  currencyCode = 'INR';
  locale = 'en-IN';
  usableAmount = '1000000';
  availableAmount = '2000000000.50';
  mobileDropArrowUp = true;
  rechargeDialog = inject(MatDialog);

  connectedPositions: ConnectedPosition[] = [
    {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetY: 6,
      offsetX: 8,
      panelClass: 'arrowTop',
    },
    {
      originX: 'end',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetY: -6,
      offsetX: 8,
      panelClass: 'arrowBottom',
    },
  ];

  openRechargeDialog() {
    const data: RechargeDialogData = {
      balance: this.usableAmount,
      currencyCode: this.currencyCode,
      locale: this.locale,
    };
    this.rechargeDialog.open(RechargeComponent, {
      data: data,
      panelClass: 'recharge-popup',
      width: '400px',
      maxHeight: window.innerHeight * 0.8 + 'px',
    });
  }
}
