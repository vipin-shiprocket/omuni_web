import { Injectable } from '@angular/core';
import { EnumTabStatus, TabListSingleOrder } from '../add-order.model';

@Injectable({
  providedIn: 'root',
})
export class SingleOrderService {
  tabs = TabListSingleOrder;
  currentTab = 0;

  onTabChange(context: 'next' | 'prev') {
    if (context === 'next') {
      this.currentTab++;
    } else {
      this.currentTab--;
    }

    this.updateTabDetails();
  }

  updateTabDetails() {
    this.tabs.forEach((tab, idx) => {
      if (idx >= this.currentTab) {
        tab.status = EnumTabStatus.pristine;
      } else {
        tab.status = EnumTabStatus.done;
      }
    });
  }
}
