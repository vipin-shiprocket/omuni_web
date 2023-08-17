import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexFiltersModules } from './index-filters.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { Dropdown } from 'bootstrap';

@Component({
  selector: 'app-index-filters',
  standalone: true,
  imports: [CommonModule, ...IndexFiltersModules],
  templateUrl: './index-filters.component.html',
  styleUrls: ['./index-filters.component.scss'],
})
export class IndexFiltersComponent implements OnDestroy {
  @Output() editView = new EventEmitter<boolean | 'cancel'>();
  @Input() set tabs(value: string[]) {
    if (value) {
      this.availableTabs = value;
    }
  }
  private subs = new SubSink();
  availableTabs: string[] = [];
  queryParams!: Record<string, string>;
  editViewMode = false;
  dropdownMenu: Dropdown | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.subs.sink = this.route.queryParams.subscribe((qp) => {
      this.queryParams = qp;
      if (!Object.keys(qp).length) {
        this.router.navigate([], { queryParams: { query: 'All' } });
      }
    });
  }

  onTabClick(tabName: string) {
    if (this.queryParams['query'] === tabName) {
      const btn = document.querySelector('.active');
      if (btn) {
        this.dropdownMenu = new Dropdown(btn);
        this.dropdownMenu.toggle();
      }
    } else {
      this.router.navigate([], { queryParams: { query: tabName } });
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

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
