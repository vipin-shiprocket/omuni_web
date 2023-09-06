import {
  AfterViewInit,
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
import { BehaviorSubject, filter, fromEvent, map } from 'rxjs';
import { SubSink } from 'subsink';
import { DebounceInputDirective } from 'src/app/directives/debounce-input.directive';
import {
  calculateElementHeight,
  calculateElementTop,
  checkWindowWidth,
} from 'src/app/utils/utils';

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
export class GlobalSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput')
  searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchResult')
  searchResult!: ElementRef<HTMLUListElement>;
  layoutService = inject(LayoutService);
  router = inject(Router);
  active = '/';
  allowedRoutes: Record<string, string> = { '/': '' };
  dropDownItemIndex: number | undefined = undefined;
  currentRoute = new BehaviorSubject<string>('');
  result: { data?: Record<'name' | 'sku', string>[] } = {};
  document = document;
  OPTIONS = OPTIONS;
  options: string[] = [];
  searchValue = '';
  selected = false;
  subSink = new SubSink();
  timeouts: number[] = [];

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

  ngAfterViewInit(): void {
    this.subSink.sink = fromEvent(this.searchInput.nativeElement, 'keydown')
      .pipe(
        map((evt) => (evt as KeyboardEvent).key),
        filter((key) =>
          ['ArrowUp', 'ArrowDown', 'Escape', 'Enter'].includes(key),
        ),
      )
      .subscribe((key) => this.handleKeyboardEvents(key));
  }

  isMobile = checkWindowWidth;

  @HostListener('document:keydown.control./')
  focusSearch() {
    this.searchInput.nativeElement.focus();
  }

  handleKeyboardEvents(key: string) {
    switch (key) {
      case 'Escape':
        this.searchInput.nativeElement.blur();
        break;

      case 'Enter':
        if (this.dropDownItemIndex !== undefined && !this.isMobile())
          this.navigate(this.dropDownItemIndex);
        else this.search(this.searchInput.nativeElement.value);
        if (this.isMobile()) {
          this.searchInput.nativeElement.blur();
        }
        break;

      case 'ArrowUp':
        if (this.dropDownItemIndex === undefined) {
          this.dropDownItemIndex = 0;
          break;
        }
        if (this.result?.data?.length) {
          this.dropDownItemIndex = Math.max(0, this.dropDownItemIndex - 1);
          const id = 'searchResult' + (this.dropDownItemIndex - 1);
          const scrollHeight = calculateElementTop(id);
          this.searchResult.nativeElement
            .getElementsByClassName('custom-scrollbar')[0]
            .scrollTo({
              top: scrollHeight,
              behavior: 'smooth',
            });
        }
        break;

      case 'ArrowDown':
        if (this.dropDownItemIndex === undefined) {
          this.dropDownItemIndex = 0;
          break;
        }
        if (this.result?.data?.length) {
          this.dropDownItemIndex = Math.min(
            this.result.data.length - 1,
            this.dropDownItemIndex + 1,
          );
          const id = 'searchResult' + this.dropDownItemIndex;
          const scrollHeight =
            calculateElementTop(id) - calculateElementHeight(id);
          this.searchResult.nativeElement
            .getElementsByClassName('custom-scrollbar')[0]
            .scrollTo({
              top: scrollHeight,
              behavior: 'smooth',
            });
        }
        break;

      default:
        break;
    }
  }

  updateActive(route: string) {
    this.active =
      Object.keys(this.allowedRoutes).find((key) =>
        this.allowedRoutes[key].startsWith(route),
      ) || '/';
  }

  search(data: string) {
    if (data.trim().length < 3) return;

    this.result = {
      data: mockData.filter((val) =>
        val.name.toLowerCase().includes(data.toLowerCase()),
      ),
    };
  }

  setSearchValue(evt: Event) {
    this.searchValue = (evt.target as HTMLInputElement).value;
  }

  onFocus() {
    if (this.isMobile()) return;
    this.selected = true;
    this.searchResult.nativeElement.classList.add('show');
  }

  onFocusOut() {
    if (this.isMobile()) return;
    this.timeouts.push(
      window.setTimeout(() => {
        this.selected = false;
        this.searchResult.nativeElement.classList.remove('show');
      }, 150),
    );
  }

  navigate(i: number) {
    const data = this.result.data ? this.result.data[i] : i;
    this.onFocusOut();
    this.reset();
    this.searchInput.nativeElement.value = '';
    this.searchValue = '';
    this.searchInput.nativeElement.blur();
    console.log('navigating to ', data);
  }

  reset() {
    this.result = {};
    this.dropDownItemIndex = undefined;
  }

  ngOnDestroy(): void {
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.subSink.unsubscribe();
  }
}
