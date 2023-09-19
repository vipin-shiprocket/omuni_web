import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MENU_LIST, MenuItem } from './layout.model';
import {
  UserPreferences,
  UserPreferencesService,
} from 'src/app/services/user-preferences.service';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  userPreferencesService = inject(UserPreferencesService);
  sideBarOpen = new BehaviorSubject<boolean>(false);
  menuItems = new BehaviorSubject<MenuItem[]>([]);

  get userPrefs() {
    return this.userPreferencesService.userPrefences;
  }

  filterMenuItems(data: UserPreferences) {
    if (!data?.sidebarItems) {
      return;
    }
    const menuFiltered = data?.sidebarItems.reduce(
      (obj: Record<string, MenuItem>, key) => {
        const item = MENU_LIST[key];
        item['key'] = key;

        //normal menu items
        if (!item.parent) {
          if (!obj[key]) obj[key] = item;
          return obj;
        }

        //sub-menu items
        if (!Object.keys(obj).includes(item.parent)) {
          obj[item.parent] = MENU_LIST[item.parent];
        }
        const index = obj[item.parent].subNav?.findIndex(
          (object) => object.route === item.route,
        );
        if (index === -1) obj[item.parent].subNav?.push(item);
        return obj;
      },
      {},
    );

    this.menuItems.next(Object.values(menuFiltered));
  }
}
