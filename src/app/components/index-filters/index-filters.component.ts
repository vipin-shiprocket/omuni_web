import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FilterDataType,
  IFilter,
  IndexFiltersModules,
} from './index-filters.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { Dropdown } from 'bootstrap';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-index-filters',
  standalone: true,
  imports: [CommonModule, ...IndexFiltersModules],
  templateUrl: './index-filters.component.html',
  styleUrls: ['./index-filters.component.scss'],
})
export class IndexFiltersComponent implements OnDestroy {
  @Output() editView = new EventEmitter<boolean | 'cancel'>();
  @Output() tabInfoUpdate = new EventEmitter();
  @Output() searchFilter = new EventEmitter<string>();
  @Input() filterData: FilterDataType | null = null;
  @Input() set tabs(value: Record<string, unknown>[]) {
    if (value) {
      this.availableTabs = value;
    }
  }
  @ViewChild('updateNameTemplate')
  updateNameTemplate!: TemplateRef<HTMLElement>;
  private subs = new SubSink();
  availableTabs: Record<string, unknown>[] = [];
  queryParams!: Record<string, string>;
  editViewMode = false;
  dropdownMenu: Dropdown | null = null;
  appliedFilters: IFilter[] = [];
  showFilters = false;
  objectvalues = Object.values;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
    this.subs.sink = this.route.queryParams.subscribe((qp) => {
      this.queryParams = qp;
      if (!Object.keys(qp).length) {
        this.router.navigate([], { queryParams: { query: 'All' } });
      }
    });
  }

  onTabClick(tab: Record<string, unknown>, ref: HTMLElement) {
    if (this.queryParams['query'] === tab['name']) {
      this.dropdownMenu = new Dropdown(ref);
      this.dropdownMenu.toggle();
    } else {
      this.router.navigate([], { queryParams: { query: tab['name'] } });
    }
  }

  onClickEditView() {
    this.editView.emit(true);
    this.editViewMode = true;
    this.dropdownMenu?.hide();
  }

  saveEditView() {
    this.editView.emit(false);
    this.editViewMode = false;
  }

  cancelEditView() {
    this.editView.emit('cancel');
    this.editViewMode = false;
  }

  updateName(index: number, context: string) {
    let tab = { ...this.availableTabs[index] };

    if (context === 'duplicate') {
      const newTab = {
        ...tab,
        name: `Copy of ${tab['name']}`,
      };
      tab = newTab;
    }

    if (index === -1) {
      const newTab = {
        name: '',
        filters: {},
      };
      tab = newTab;
    }

    const dialog = this.dialog.open(this.updateNameTemplate, {
      minWidth: '50%',
      data: { tab, context },
    });

    this.subs.sink = dialog.afterClosed().subscribe((result) => {
      if (!result) {
        return;
      }

      if (result === 'delete') {
        this.availableTabs.splice(index, 1);
        this.tabInfoUpdate.emit('delete');
        return;
      }

      if (index === -1 || context === 'duplicate') {
        this.availableTabs.push(result);
      } else {
        this.availableTabs[index] = result;
      }
      this.router.navigate([], { queryParams: { query: result['name'] } });
      this.tabInfoUpdate.emit(result);
    });
  }

  addFilter(filter: IFilter) {
    this.appliedFilters.push(filter);
  }

  clearAll() {
    Object.values(this.filterData ?? {}).forEach((filter) => {
      filter['value'] = [];
    });
    this.appliedFilters = [];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchFilter.emit(filterValue);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
