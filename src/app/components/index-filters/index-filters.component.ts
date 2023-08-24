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
  IEditMode,
  IFilter,
  IndexFiltersModules,
} from './index-filters.model';
import { SubSink } from 'subsink';
import { Dropdown } from 'bootstrap';
import { MatDialog } from '@angular/material/dialog';
import { IOption } from '../chip-selectbox/chip-selectbox.model';

@Component({
  selector: 'app-index-filters',
  standalone: true,
  imports: [CommonModule, IndexFiltersModules],
  templateUrl: './index-filters.component.html',
  styleUrls: ['./index-filters.component.scss'],
})
export class IndexFiltersComponent implements OnDestroy {
  @Output() editView = new EventEmitter<IEditMode>();
  @Output() filterChange = new EventEmitter<IFilter | string>();
  @Output() tabChange = new EventEmitter<Record<string, unknown> | 'delete'>();
  @Output() currentTab = new EventEmitter<number>();
  @Output() saveFilters = new EventEmitter();
  @Input() filterData: FilterDataType | null = null;
  @Input() set tabs(value: Record<string, unknown>[]) {
    if (value) {
      this.availableTabs = value;
      this.selectedTab = this.availableTabs[0];
    }
  }
  @Input() selectedTab: Record<string, unknown> | undefined;
  @ViewChild('updateNameTemplate')
  updateNameTemplate!: TemplateRef<HTMLElement>;
  private subs = new SubSink();
  availableTabs: Record<string, unknown>[] = [];
  editViewMode: IEditMode = { editMode: false };
  dropdownMenu: Dropdown | null = null;
  appliedFilters: IFilter[] = [];
  showFilters = false;
  objectvalues = Object.values;

  constructor(private dialog: MatDialog) {}

  onTabClick(tab: Record<string, unknown>, ref: HTMLElement, tabIndex: number) {
    if (this.selectedTab && this.selectedTab['name'] === tab['name']) {
      this.dropdownMenu = new Dropdown(ref);
      this.dropdownMenu.toggle();
    } else {
      this.tabChange.emit(tab);
      this.currentTab.emit(tabIndex);
      this.selectedTab = tab;
    }
  }

  onClickEditView(index: number) {
    this.editViewMode = {
      editMode: true,
      action: 'edit',
      index,
    };
    this.editView.emit(this.editViewMode);
    this.dropdownMenu?.hide();
  }

  saveEditView() {
    this.editViewMode = {
      ...this.editViewMode,
      editMode: false,
      action: 'save',
    };
    this.editView.emit(this.editViewMode);
  }

  cancelEditView() {
    this.editViewMode = {
      ...this.editViewMode,
      editMode: false,
      action: 'cancel',
    };
    this.editView.emit(this.editViewMode);
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
        columns: this.availableTabs[0]['columns'] ?? [],
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
        this.selectedTab = this.availableTabs[0];
        this.tabChange.emit('delete');
        return;
      }

      if (index === -1 || context === 'duplicate') {
        this.availableTabs.push(result);
      } else {
        this.availableTabs[index] = result;
      }
      this.selectedTab = result;
      this.tabChange.emit(result);
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
    this.filterChange.emit();
  }

  textSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterChange.emit(filterValue);
  }

  onUpdateFilter(evt: IOption[], filter: IFilter) {
    filter.value = evt;
    this.filterChange.emit(filter);
  }

  cancelFilterUpdate() {
    this.showHideFilters();
    this.filterChange.emit();
  }

  saveFilterUpdate() {
    this.saveFilters.emit();
    this.showHideFilters();
  }

  showHideFilters() {
    this.showFilters = !this.showFilters;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
