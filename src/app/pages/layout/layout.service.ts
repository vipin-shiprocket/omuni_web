import { Injectable, OnDestroy, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MENU_LIST, MenuItem } from './layout.model';
import { UserPreferencesService } from 'src/app/services/user-preferences.service';
import { SubSink } from 'subsink';

@Injectable({
  providedIn: 'root',
})
export class LayoutService implements OnDestroy {
  userPreferencesService = inject(UserPreferencesService);
  sideBarOpen = new BehaviorSubject<boolean>(false);
  menuItems = new BehaviorSubject<MenuItem[]>([]);
  subSink = new SubSink();

  constructor() {
    this.userPreferencesService.init(); //@TODO: call in auth service after successful login
    this.getSidebarItems();
  }

  getSidebarItems() {
    this.subSink.sink = this.userPreferencesService.userPrefences.subscribe(
      (data) => {
        if (!data?.sidebarItems) {
          return;
        }
        const menuFiltered = data?.sidebarItems.reduce(
          (obj: Record<string, MenuItem>, key) => {
            const item = MENU_LIST[key];

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
      },
    );
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
}
