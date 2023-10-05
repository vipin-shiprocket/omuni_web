import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { GenericTabModules, ManifestColumns } from '../orders.model';
import { MatTableDataSource } from '@angular/material/table';
import { Expand } from 'src/app/utils/animation';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-manifest-tab',
  standalone: true,
  imports: [CommonModule, GenericTabModules],
  templateUrl: './manifest-tab.component.html',
  styleUrls: ['./manifest-tab.component.scss', '../orders.component.scss'],
  animations: [Expand],
})
export class ManifestTabComponent implements OnDestroy {
  @Input() dataSource: MatTableDataSource<never[]> = new MatTableDataSource(
    undefined,
  );
  columns = ManifestColumns;
  disableSort = true;
  expandedElement: never | null = null;
  displayedColumns = this.getColumnArrangement();
  columnsToDisplayWithExpand = [...this.displayedColumns];

  constructor(public odService: OrdersService) {}

  isAllSelected() {
    const numSelected = this.odService.selection?.selected?.length;
    const numRows = this.dataSource?.data?.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.odService.selection.clear();
      return;
    }

    this.odService.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: never): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.odService.selection.isSelected(row) ? 'deselect' : 'select'}
    row ${row['position'] + 1}`;
  }

  getColumnArrangement() {
    return this.columns
      .filter((d) => d.visible)
      .map((d) => d.name)
      .slice();
  }

  ngOnDestroy(): void {
    this.odService.selection.clear();
  }
}
