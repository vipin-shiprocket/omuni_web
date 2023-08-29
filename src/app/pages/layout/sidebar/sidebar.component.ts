import { Component, Input, OnDestroy, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenuItem } from '../layout.model';
import { LayoutService } from '../layout.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    NgOptimizedImage,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnDestroy {
  @Input() menu: MenuItem[] = [];

  layoutService = inject(LayoutService);
  private subSink = new SubSink();
  dummy = Array.from({ length: 12 }, (_, i) => i + 1);

  set sidebarOpen(value: boolean) {
    this.layoutService.sideBarOpen.next(value);
  }

  constructor() {
    this.subSink.sink = this.layoutService.menuItems.subscribe((data) => {
      this.menu = data;
    });
  }

  checkRoute(name: string): boolean {
    const pathname = window.location.pathname;
    if (name === '/') {
      return name === pathname;
    }
    return pathname.includes(name);
  }

  checkChildRoute(name: string): boolean {
    const pathname = window.location.pathname;
    if (name === '/') {
      return name === pathname;
    }
    const lastPart = pathname.split('/').pop();
    return lastPart == name;
  }

  close() {
    this.sidebarOpen = false;
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
