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
import { DebounceInputDirective } from 'src/app/directives/debounce-input.directive';

const mockData: Record<'name' | 'sku', string>[] = [
  {
    name: 'Adidas shoes 1',
    sku: 'SKU1',
  },
  {
    name: 'Adidas shoes 2',
    sku: 'SKU2',
  },
  {
    name: 'Adidas shoes 3',
    sku: 'SKU3',
  },
  {
    name: 'Adidas shoes 4',
    sku: 'SKU4',
  },
  {
    name: 'Adidas shoes 5',
    sku: 'SKU5',
  },
  {
    name: 'Adidas shoes 6',
    sku: 'SKU6',
  },
  {
    name: 'Adidas shoes 7',
    sku: 'SKU7',
  },
  {
    name: 'Adidas shoes 8',
    sku: 'SKU8',
  },
  {
    name: 'Adidas shoes 9',
    sku: 'SKU9',
  },
  {
    name: 'Adidas shoes 10',
    sku: 'SKU10',
  },
  {
    name: 'Nike shoes 1',
    sku: 'SKU11',
  },
];

@Component({
  selector: 'app-global-search',
  standalone: true,
  imports: [CommonModule, MatIconModule, DebounceInputDirective],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
})
export class GlobalSearchComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput')
  searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchResult')
  searchResult!: ElementRef<HTMLUListElement>;
  layoutService = inject(LayoutService);
  router = inject(Router);
  active = '/';
  allowedRoutes: Record<string, string> = { '/': '' };
  currentRoute = new BehaviorSubject<string>('');
  result: { data?: Record<'name' | 'sku', string>[] } = {};
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
    this.searchInput.nativeElement.click();
  }

  updateActive(route: string) {
    this.active =
      Object.keys(this.allowedRoutes).find((key) =>
        this.allowedRoutes[key].startsWith(route),
      ) || '/';
  }

  search(data: string) {
    if (data.trim() === '') return;

    this.result = {
      data: mockData.filter((val) =>
        val.name.toLowerCase().includes(data.toLowerCase()),
      ),
    };
  }

  onFocus() {
    this.selected = true;
  }

  onFocusOut() {
    this.selected = false;
  }

  navigate() {
    console.log('navigating...');
    this.searchResult.nativeElement.classList.remove('show');
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
