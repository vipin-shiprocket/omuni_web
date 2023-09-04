import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LayoutService } from '../layout.service';
import { OPTIONS } from './global-search.model';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput')
  searchInput!: ElementRef<HTMLInputElement>;
  layoutService = inject(LayoutService);
  router = inject(Router);
  active = '/';
  allowedRoutes: Record<string, string> = { '/': '' };
  currentRoute = new BehaviorSubject<string>('');
  document = document;
  OPTIONS = OPTIONS;
  options: string[] = [];
  selected = false;
  subSink = new SubSink();

  ngOnInit(): void {
    this.currentRoute.next(this.router.routerState.snapshot.url.slice(1));

    this.subSink.sink = this.layoutService.userPrefs.subscribe((data) => {
      if (!data) return;
      this.options = Object.keys(OPTIONS).filter((key) =>
        data.sidebarItems.includes(key),
      );
    });

    this.subSink.sink =
      this.layoutService.userPreferencesService.allowedRoutes.subscribe(
        (data) => {
          this.allowedRoutes = data;
          this.updateActive(this.currentRoute.value);
        },
      );

    this.subSink.sink = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((evt) => {
        this.currentRoute.next((evt as NavigationEnd).url.slice(1));
      });

    this.subSink.sink = this.currentRoute.subscribe((data) => {
      this.updateActive(data);
    });
  }

  @HostListener('document:keydown.control./')
  focusSearch() {
    this.searchInput.nativeElement.focus();
  }

  updateActive(route: string) {
    this.active =
      Object.keys(this.allowedRoutes).find((key) =>
        this.allowedRoutes[key].startsWith(route),
      ) || '/';
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
