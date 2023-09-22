import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LayoutService } from '../layout.service';
import { GlobalSearchComponent } from 'src/app/components/global-search/global-search.component';
import { checkWindowWidth } from 'src/app/utils/utils';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    GlobalSearchComponent,
  ],
})
export class HeaderComponent {
  sidebarOpen = inject(LayoutService).sideBarOpen;

  get showSearch() {
    return checkWindowWidth();
  }

  openSideBar() {
    this.sidebarOpen.next(true);
  }
}
