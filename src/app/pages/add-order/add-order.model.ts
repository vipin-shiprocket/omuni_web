export interface ITabSingleOrder {
  id: string;
  name: string;
  status: EnumTabStatus;
}

export enum EnumTabStatus {
  'done',
  'pristine',
}

export const TabListSingleOrder: ITabSingleOrder[] = [
  {
    id: 'buyer',
    name: 'Buyer Details',
    status: EnumTabStatus.pristine,
  },
  {
    id: 'order',
    name: 'Order Details',
    status: EnumTabStatus.pristine,
  },
];
