import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { SvgEnum } from 'src/app/enum';
import { LayoutService } from './layout.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  iconRegistry = inject(MatIconRegistry);
  domSanitizer = inject(DomSanitizer);
  layoutService = inject(LayoutService);
  private subSink = new SubSink();

  set sidebarOpen(value: boolean) {
    this.layoutService.sideBarOpen.next(value);
  }

  constructor() {
    this.registerCustomIcons();
  }

  ngOnInit(): void {
    this.subSink.sink = this.layoutService.userPrefs().subscribe((data) => {
      if (data) this.layoutService.filterMenuItems(data);
    });

    this.subSink.sink = this.layoutService.userPreferencesService
      .getUserPreferences()
      .subscribe((data) => {
        this.layoutService.userPrefs().next(data);
        this.layoutService.userPreferencesService.setAllowedRoutes();
      });
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
    if (!this.layoutService.sideBarOpen.value) {
      this.sidebarOpen = true;
    }
  }

  handleMouseLeave() {
    if (this.layoutService.sideBarOpen.value) {
      this.sidebarOpen = false;
    }
  }

  close() {
    this.handleMouseLeave();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
