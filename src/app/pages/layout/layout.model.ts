export interface MenuItem {
  key?: string;
  displayName: string;
  iconName: string;
  route?: string;
  subNav?: MenuItem[];
  parent?: string;
  isBottomNav?: boolean;
}

//The arrangement of items in the following list determines the ordering of the SideMenu content
export const MENU_LIST: Record<string, MenuItem> = {
  analytics: {
    displayName: 'Analytics',
    iconName: 'assets:analytics',
    route: 'analytics',
  },
  orders: {
    displayName: 'Orders',
    iconName: 'assets:orders',
    route: 'orders',
  },
  products: {
    displayName: 'Products',
    iconName: 'assets:products',
    route: 'products',
    subNav: [],
  },
  catalog: {
    displayName: 'Products',
    iconName: 'assets:products',
    route: 'catalog',
    parent: 'products',
  },
  inventory: {
    displayName: 'Inventory',
    iconName: 'assets:products',
    route: 'inventory',
    parent: 'products',
  },
  automation: {
    displayName: 'Automation',
    iconName: 'assets:automation',
    route: 'automation',
  },
  support: {
    displayName: 'Support',
    iconName: 'assets:support',
    route: 'support',
    isBottomNav: true,
  },
  settings: {
    displayName: 'Settings',
    iconName: 'assets:settings',
    route: 'settings',
    isBottomNav: true,
  },
  getStarted: {
    displayName: 'Get Started',
    iconName: 'assets:getStarted',
    route: 'getting-started',
    isBottomNav: true,
  },
};
