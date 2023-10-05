import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GenericTabModules, ManifestColumns } from '../orders.model';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Expand } from 'src/app/utils/animation';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-manifest-tab',
  standalone: true,
  imports: [CommonModule, GenericTabModules],
  templateUrl: './manifest-tab.component.html',
  styleUrls: ['./manifest-tab.component.scss', '../orders.component.scss'],
  animations: [Expand],
})
export class ManifestTabComponent {
  @Input() dataSource: MatTableDataSource<never[]> = new MatTableDataSource(
    undefined,
  );
  columns = ManifestColumns;
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
