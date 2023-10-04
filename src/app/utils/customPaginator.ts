import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class CustomPaginator implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = 'First page';
  itemsPerPageLabel = 'Items per page:';
  lastPageLabel = 'Last page';
  nextPageLabel = 'Next page';
  previousPageLabel = 'Previous page';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    const from = page * pageSize;
    const to = length < pageSize ? from + length : (page + 1) * pageSize;
    return `Showing items ${from + 1} - ${to}`;
  }
}
