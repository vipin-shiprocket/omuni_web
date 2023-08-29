import { IndexFiltersComponent } from 'src/app/components/index-filters/index-filters.component';
import { IndexTableComponent } from 'src/app/components/index-table/index-table.component';
import { FilterDataType } from 'src/app/components/index-filters/index-filters.model';

export const OrdersModules = [IndexFiltersComponent, IndexTableComponent];

export const FiltersData: FilterDataType = {
  statuses: {
    name: 'statuses',
    label: 'Status',
    type: 'radio',
    value: [],
    data: [],
  },
  channels: {
    name: 'channels',
    label: 'Channels',
    type: 'select',
    value: [],
    multiple: true,
    data: [
      {
        value: 589548,
        display: 'CUSTOM',
      },
      {
        value: 589811,
        display: 'SHOPIFY',
      },
      {
        value: 1401511,
        display: 'EASYECOM',
      },
      {
        value: 1749542,
        display: 'UNICOMMERCE',
      },
      {
        value: 4095274,
        display: 'Shopify_3',
      },
      {
        value: 4095298,
        display: 'VINCULUM',
      },
      {
        value: 4095474,
        display: 'Omuni',
      },
      {
        value: 4095491,
        display: 'Shopify_4',
      },
    ],
  },
  paymentTypes: {
    name: 'paymentTypes',
    label: 'Payment',
    type: 'select',
    value: [],
    data: [
      {
        value: 'cod',
        display: 'Cash on Delivery',
      },
      {
        value: 'prepaid',
        display: 'Prepaid',
      },
    ],
  },
  orderTag: {
    name: 'orderTag',
    label: 'order tag',
    type: 'select',
    value: [],
    multiple: true,
    data: [
      {
        value: 'SR Promise',
        display: 'SR Promise',
      },
      {
        value: 'Sonalitag3',
        display: 'Sonalitag3',
      },
      {
        value: 'abcssss',
        display: 'abcssss',
      },
      {
        value: 'ReturnOrderCreated',
        display: 'ReturnOrderCreated',
      },
    ],
  },
};
