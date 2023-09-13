import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, of } from 'rxjs';
import { MENU_LIST } from '../pages/layout/layout.model';
import { MemoFn, STORAGE_TYPE } from '../utils/memo.decorator';

export interface UserPreferences {
  sidebarItems: string[];
}

const temp: UserPreferences = {
  sidebarItems: ['orders', 'catalog', 'inventory', 'settings'],
};

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  userPrefences = new BehaviorSubject<UserPreferences | null>(null);
  allowedRoutes = new BehaviorSubject<Record<string, string>>({ '/': '' });

  @MemoFn({ ttl: 10000, cacheStrategy: STORAGE_TYPE.PERSISTENT })
  getUserPreferences() {
    return of(temp).pipe(delay(2000));
  }

  setAllowedRoutes() {
    const routes: Record<string, string> = { '/': '' };
    const items = this.userPrefences.value?.sidebarItems;

    if (!items) {
      return;
    }

    const routesFiltered = items.reduce((arr: Record<string, string>, key) => {
      const item = MENU_LIST[key];

      //normal menu items
      if (!item.parent) {
        if (item.route && !Object.values(arr).includes(item.route))
          arr[key] = item.route;
      } else {
        //sub-menu items
        const chidRoute = MENU_LIST[item.parent].route + '/' + item.route;
        if (!Object.values(arr).includes(chidRoute)) arr[key] = chidRoute;
      }

      return arr;
    }, routes);

    this.allowedRoutes.next(routesFiltered);
  }
}
