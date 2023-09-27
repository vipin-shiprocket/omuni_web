import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutService } from '../layout.service';
import { GlobalSearchComponent } from 'src/app/components/global-search/global-search.component';
import { checkWindowWidth } from 'src/app/utils/utils';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { WalletComponent } from '../wallet/wallet.component';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    GlobalSearchComponent,
    WalletComponent,
  ],
})
export class HeaderComponent {
  sidebarOpen = inject(LayoutService).sideBarOpen;

  get isMobile() {
    return checkWindowWidth();
  }

  openSideBar() {
    this.sidebarOpen.next(true);
  }
}
