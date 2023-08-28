import { Component, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SvgEnum } from 'src/app/enum';
import { LayoutService } from './layout.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  sidenaveOpen = false;
  iconRegistry = inject(MatIconRegistry);
  domSanitizer = inject(DomSanitizer);
  layoutService = inject(LayoutService);

  get sidebarOpen() {
    return this.layoutService.sideBarOpen.value;
  }

  set sidebarOpen(value) {
    this.layoutService.sideBarOpen.next(value);
  }

  constructor() {
    this.registerCustomIcons();
  }

  registerCustomIcons(): void {
    Object.keys(SvgEnum).forEach((key) => {
      this.iconRegistry.addSvgIconInNamespace(
        'assets',
        key,
        this.domSanitizer.bypassSecurityTrustResourceUrl(
          `../../../assets/svg/${SvgEnum[key as keyof typeof SvgEnum]}.svg`,
        ),
      );
    });
  }

  handleMouseEnter() {
    if (!this.sidebarOpen) {
      this.sidebarOpen = true;
    }
  }

  handleMouseLeave() {
    if (this.sidebarOpen) {
      this.sidebarOpen = false;
    }
  }

  close() {
    this.handleMouseLeave();
  }
}
