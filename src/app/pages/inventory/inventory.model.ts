// ---------Temp-------------
export const InventoryTabs = [
  {
    name: 'All',
    filters: {},
    canUpdate: false,
    columns: ['name', 'sku', 'available', 'blocked', 'total', 'action'],
  },
];
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
