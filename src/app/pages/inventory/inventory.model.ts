// ---------Temp-------------
export const InventoryTabs = [
  {
    name: 'All',
    filters: {},
    canUpdate: false,
    columns: ['name', 'sku', 'available', 'blocked', 'total', 'action'],
  },
];

export const analyticsResponse: Record<
  string,
  { amount: number; direction: string }
> = {
  total: {
    amount: 25,
    direction: 'up',
  },
  count: {
    amount: 12,
    direction: 'up',
  },
  out: {
    amount: 43,
    direction: 'down',
  },
  blocked: {
    amount: 67,
    direction: 'up',
  },
  available: {
    amount: 2,
    direction: 'down',
  },
};

// --------------------------
export type ErrorResponse = Record<'data', string>;

export type FileType = 'RESET' | 'DELTA';

export type FileUploadResponse = {
  fileName: string;
  fileType: FileType;
  preSignedUrl: string;
};

export type S3UploadResponse = {
  [string: string]: string | unknown;
  etag: string;
};

export type AcknowledgeUploadResponse = {
  checksum: string;
  fileName: string;
  fileType: FileType;
  preSignedUrl: string;
  status: boolean;
};

export type UpdateInventoryBody = {
  ean: string;
  fcId: string;
  quantity: string;
  transactionType: 'CREDIT' | 'DEBIT' | 'OVERWRITE';
};

export const analytics = [
  {
    name: 'Total Inventory',
    image: 'assets/images/inventory/inventoryTotal.svg',
    key: 'total',
  },
  {
    name: 'Total count of SKUs',
    image: 'assets/images/inventory/inventorySKUCount.svg',
    key: 'count',
  },
  {
    name: 'Out of stock SKUs',
    image: 'assets/images/inventory/inventoryOut.svg',
    key: 'out',
  },
  {
    name: 'Blocked',
    image: 'assets/images/inventory/inventoryBlocked.svg',
    key: 'blocked',
  },
  {
    name: 'Available',
    image: 'assets/images/inventory/inventoryAvailable.svg',
    key: 'available',
  },
];
