import { plural } from './pluralize';

export {};

declare global {
  interface String {
    readonly plural: string;
  }
}

if (!String.prototype.plural) {
  Object.defineProperty(String.prototype, 'plural', {
    get: function (this: string) {
      return plural(this);
    },
  });
}
