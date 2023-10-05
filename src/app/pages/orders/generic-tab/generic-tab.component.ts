import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { GenericTabModules, OrderColumns } from '../orders.model';
import { MatTableDataSource } from '@angular/material/table';
import { DropdownRendererDirective } from 'src/app/directives/dropdown.directive';
import { OrdersService } from '../orders.service';

@Component({
  selector: 'app-generic-tab',
  standalone: true,
  imports: [CommonModule, GenericTabModules, DropdownRendererDirective],
  templateUrl: './generic-tab.component.html',
  styleUrls: ['./generic-tab.component.scss', '../orders.component.scss'],
})
export class GenericTabComponent implements OnDestroy {
  @Input() dataSource: MatTableDataSource<never[]> = new MatTableDataSource(
    undefined,
  );
  columns = OrderColumns;
  disableSort = true;
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
