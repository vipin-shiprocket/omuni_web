/**
 * Filter options in the global search bar
 * @type `Record`<filter value: `string`, filter display name: `string`>
 */
export const OPTIONS: Record<string, Record<string, string>> = {
  catalog: { displayName: 'Products', icon: 'assets:productsMini' },
  orders: { displayName: 'Orders', icon: 'assets:ordersMini' },
  inventory: { displayName: 'Inventory', icon: 'assets:inventoryMini' },
};
