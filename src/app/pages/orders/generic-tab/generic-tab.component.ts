import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { GenericTabModules, ITab, OrderColumns } from '../orders.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Expand } from 'src/app/utils/animation';

@Component({
  selector: 'app-generic-tab',
  standalone: true,
  imports: [CommonModule, GenericTabModules],
  templateUrl: './generic-tab.component.html',
  styleUrls: ['./generic-tab.component.scss', '../orders.component.scss'],
  animations: [Expand],
})
export class GenericTabComponent {
  @Input() dataSource: MatTableDataSource<never[]> = new MatTableDataSource(
    undefined,
  );
  columns = OrderColumns;
  disableSort = true;
  selection = new SelectionModel<never[]>(true, []);
  expandedElement: never | null = null;
  displayedColumns = this.getColumnArrangement();
  columnsToDisplayWithExpand = [...this.displayedColumns];

  isAllSelected() {
    const numSelected = this.selection?.selected?.length;
    const numRows = this.dataSource?.data?.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: never): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }

    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}
    row ${row['position'] + 1}`;
  }

  getColumnArrangement() {
    return this.columns
      .filter((d) => d.visible)
      .map((d) => d.name)
      .slice();
  }
}
