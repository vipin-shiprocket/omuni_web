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
  ITab,
  IndexFiltersModules,
} from './index-filters.model';
import { SubSink } from 'subsink';
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
  @Output() currentTab = new EventEmitter<number>();
  @Output() saveFilters = new EventEmitter();
  @Output() filterText = new EventEmitter<string>();
  @Input() filterData: FilterDataType | null = null;
  @Input() set tabs(value: ITab[]) {
    if (value) {
      this.availableTabs = value;
      this.selectedTab = { tabData: this.availableTabs[0], index: 0 };
    }
  }
  @Input() selectedTab: { tabData: ITab; index: number } | undefined;
  @ViewChild('updateNameTemplate')
  updateNameTemplate!: TemplateRef<HTMLElement>;
  private subs = new SubSink();
  availableTabs: ITab[] = [];
  editViewMode: IEditMode = { editMode: false };
  appliedFilters: IFilter[] = [];
  showFilters = false;
  searchText = '';
  objectvalues = Object.values;

  constructor(private dialog: MatDialog) {}

  onTabClick(tab: ITab, ref: HTMLElement, tabIndex: number) {
    // evt.stopPropagation();
    // ref.click();
    if (this.selectedTab?.tabData?.name === tab['name']) return;
    this.currentTab.emit(tabIndex);
    this.selectedTab = { tabData: tab, index: tabIndex };
    this.resetFilters();
    this.setAppliedFilters(tab.filters);
  }

  setAppliedFilters(filters: ITab['filters']) {
    Object.keys(filters).forEach((key) => {
      const filterValues = filters[key];
      let filter: IFilter;
      if (key === 'query' && typeof filterValues === 'string') {
        this.searchText = filterValues;
        this.filterText.emit(this.searchText);
      } else if (this.filterData) {
        filter = this.filterData[key];
        const data = filter.data;
        filter.value = data.filter((d) => {
          return Array.isArray(filterValues) && filterValues.includes(d.value);
        });
        this.appliedFilters.push(filter);
      }
    });
  }

  resetFilters() {
    this.appliedFilters = [];
    this.searchText = '';
    this.filterText.emit(this.searchText);
    if (this.filterData) {
      const fD = this.filterData;
      Object.keys(this.filterData).forEach((fKey) => {
        fD[fKey].value = [];
      });
    }
  }

  onClickEditView() {
    this.editViewMode = {
      editMode: true,
      action: 'edit',
    };
    this.editView.emit(this.editViewMode);
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

  updateTabName(index: number, context: string) {
    let tab = { ...this.availableTabs[index] };

    if (context === 'duplicate') {
      const newTab = {
        ...tab,
        name: `Copy of ${tab['name']}`,
      };
      tab = newTab;
    }

    if ([-1, -2].includes(index)) {
      const newTab = {
        name: '',
        filters: {},
        canUpdate: true,
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
        this.selectedTab = { tabData: this.availableTabs[0], index: 0 };
        this.currentTab.emit(0);
        return;
      }

      if ([-1, -2].includes(index) || context === 'duplicate') {
        this.availableTabs.push(result);
        this.currentTab.emit(this.availableTabs.length - 1);
        if (index === -2) {
          this.showHideFilters();
          this.saveFilters.emit();
        }
      } else {
        this.availableTabs[index] = result;
        this.currentTab.emit(index);
      }
      this.selectedTab = { tabData: result, index };
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
    this.filterChange.emit(undefined);
  }

  textSearch() {
    this.filterChange.emit(this.searchText);
  }

  onUpdateFilter(evt: IOption[], filter: IFilter) {
    filter.value = evt;
    this.filterChange.emit(filter);
  }

  cancelFilterUpdate() {
    // clear filter having no value
    this.appliedFilters = this.appliedFilters.filter(
      (fltr) => fltr.value.length,
    );
    this.showHideFilters();
    this.filterChange.emit(undefined);
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
