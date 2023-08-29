import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, delay, of } from 'rxjs';
import { MENU_LIST } from '../pages/layout/layout.model';

export interface UserPreferences {
  sidebarItems: string[];
}

@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService {
  userPrefences = new BehaviorSubject<UserPreferences | null>(null);
  allowedRoutes = new Subject<string[]>();

  temp = {
    sidebarItems: ['orders', 'inventory', 'catalog', 'settings'],
  };

  getUserPreferences() {
    return of(this.temp).pipe(delay(2000));
  }

  setAllowedRoutes() {
    const routes: string[] = [];
    const items = this.userPrefences.value?.sidebarItems;

    if (!items) {
      return;
    }

    const routesFiltered = items.reduce((arr: string[], key) => {
      const item = MENU_LIST[key];

      //normal menu items
      if (!item.parent) {
        if (item.route && !arr.includes(item.route)) arr.push(item.route);
      } else {
        //sub-menu items
        const chidRoute = MENU_LIST[item.parent].route + '/' + item.route;
        if (!arr.includes(chidRoute)) arr.push(chidRoute);
      }

      return arr;
    }, routes);

    this.allowedRoutes.next(routesFiltered);
  }
}
