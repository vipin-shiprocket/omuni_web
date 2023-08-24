import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IColumnData,
  IPaginationData,
  IndexTableModules,
  LooseObject,
} from './index-table.model';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-index-table',
  standalone: true,
  imports: [CommonModule, ...IndexTableModules],
  templateUrl: './index-table.component.html',
  styleUrls: ['./index-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexTableComponent implements AfterViewInit {
  @Output() pageEvent = new EventEmitter<PageEvent>();
  @Input({ required: true }) set tableData(value: LooseObject[]) {
    if (value?.length) {
      this.dataSource = new MatTableDataSource(value);
    }
  }
  @Input() set displayedColumns(value: IColumnData[]) {
    if (value?.length) {
      this._displayedColumns = value;
      this.columnsToDisplay = this.getColumnArrangement();
    }
  }

  @Input() set editMode(value: boolean) {
    this._enableEditMode = value;

    if (value === true) {
      // show all columns
      this.columnsToDisplay = this._displayedColumns.map((d) => d.name).slice();
    } else {
      const columnArrangement = this.getColumnArrangement();
      this.columnsToDisplay = columnArrangement;
    }
  }

  @Input() set searchText(value: string) {
    if (value) {
      this.dataSource.filter = value.trim().toLowerCase();
    } else {
      this.dataSource.filter = ' ';
    }
  }

  @Input() paginationData: IPaginationData | null = null;
  @Input() enableSort = true;

  @ViewChild(MatSort) sort!: MatSort;
  columnsToDisplay: string[] = [];
  _displayedColumns: IColumnData[] = [];
  _enableEditMode = false;
  dataSource: MatTableDataSource<LooseObject> = new MatTableDataSource(
    undefined,
  );
  selection = new SelectionModel<LooseObject>(true, []);

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: never): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row['position'] + 1
    }`;
  }

  hideColumn(columnData: IColumnData) {
    columnData['visible'] = !columnData['visible'];
  }

  getColumnArrangement() {
    return this._displayedColumns
      .filter((d) => d.visible)
      .map((d) => d.name)
      .slice();
  }
}
