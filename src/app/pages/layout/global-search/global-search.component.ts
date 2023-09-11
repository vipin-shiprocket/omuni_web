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
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { LayoutService } from '../layout.service';
import { OPTIONS } from './global-search.model';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, delay, filter, fromEvent, map, of } from 'rxjs';
import { SubSink } from 'subsink';
import { DebounceInputDirective } from 'src/app/directives/debounce-input.directive';
import { calculateElementHeight, checkWindowWidth } from 'src/app/utils/utils';

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
  imports: [
    CommonModule,
    DebounceInputDirective,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './global-search.component.html',
  styleUrls: ['./global-search.component.scss'],
})
export class GlobalSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput')
  searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('searchResult')
  searchResult!: ElementRef<HTMLUListElement>;
  @ViewChild('toolTip')
  toolTip!: MatTooltip;
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
  resultItemTops = new Map<number, number>();
  searchValue = '';
  selected = false;
  subSink = new SubSink();
  timeouts: number[] = [];

  get isHome() {
    return this.active === '/';
  }

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
      this.reset();
      this.clear(); //TODO: remove if not needed
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

  @HostListener('window:popstate')
  closeModal() {
    if (!this.isMobile()) return;

    const isOpen = document
      .getElementById('mobileSearchModal')
      ?.classList.contains('show');

    if (isOpen) document.getElementById('searchModalClose')?.click();
  }

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

          const scrollHeight = this.resultItemTops.get(this.dropDownItemIndex);

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

          const scrollHeight = this.resultItemTops.get(this.dropDownItemIndex);

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

    //API call
    this.subSink.sink = of(
      mockData.filter((val) =>
        val.name.toLowerCase().includes(data.toLowerCase()),
      ),
    )
      .pipe(
        delay(1000),
        map((data) => ({ data: data })),
      )
      .subscribe((response) => {
        //handle result
        this.result = response;
        this.timeouts.push(
          window.setTimeout(() => {
            this.setResultsHeights();
          }, 50),
        );

        this.toolTip.disabled = false;
        this.toolTip.show();
      });
  }

  setResultsHeights() {
    this.resultItemTops.clear();

    if (!this.result.data?.length) return;

    this.resultItemTops.set(0, 0);
    let prevTop = 0;
    for (let index = 1; index < this.result.data?.length; index++) {
      const id = 'searchResult' + index;
      const height = prevTop + calculateElementHeight(id);
      this.resultItemTops.set(index, height);
      prevTop = height;
    }
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
    this.clear();
    console.log('navigating to ', data);
  }

  reset() {
    this.result = {};
    this.dropDownItemIndex = undefined;
    this.resultItemTops.clear();
    if (this.toolTip) {
      this.toolTip.disabled = true;
      this.toolTip.hide();
    }
  }

  clear() {
    this.searchValue = '';
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
      this.searchInput.nativeElement.blur();
    }
  }

  modalHistoryPush() {
    window.history.pushState(null, document.title, location.href);
  }

  ngOnDestroy(): void {
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.subSink.unsubscribe();
  }
}
