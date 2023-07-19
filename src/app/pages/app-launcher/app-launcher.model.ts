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
