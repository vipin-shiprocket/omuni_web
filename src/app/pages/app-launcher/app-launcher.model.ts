export interface IUserApp {
  app: IApp;
  id: number;
  tableClient: Record<string, string>;
  tableUserByEnabledby: Record<string, string>;
  tableUserByUser: Record<string, string>;
}

export interface IApp {
  id: number;
  name: string;
  displayname: string;
}
export interface IAppModal {
  id: string;
  name: string;
  fullname: string;
  logo: string;
  data: IUserApp | null;
}

export const AvailableApp: Record<string, IAppModal> = {
  fms: {
    id: 'fms',
    name: 'FMS',
    fullname: 'Freight Management System',
    logo: 'local_shipping',
    data: null,
  },
  oms: {
    id: 'oms',
    name: 'OMS',
    fullname: 'Order Management System',
    logo: 'add_shopping_cart',
    data: null,
  },
  wms: {
    id: 'wms',
    name: 'WMS',
    fullname: 'Warehouse Management System',
    logo: 'inventory_2',
    data: null,
  },
  ams: {
    id: 'ams',
    name: 'AMS',
    fullname: 'Attendance Management System',
    logo: 'schedule',
    data: null,
  },
};

export interface IMenu {
  name: string;
  href: string;
  imageUrl: string;
  readAccess: boolean;
  editAccess: boolean;
  createAccess: boolean;
  deleteAccess: boolean;
  subMenu: IMenu[];
}
