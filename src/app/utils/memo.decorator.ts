import { Observable, of } from 'rxjs';

const PREFIX = 'o2memo:';
const CACHE_MAP = new Map<string, MemoValue>();

export enum STORAGE_TYPE {
  IN_MEMORY = 'map',
  PERSISTENT = 'localStorage', //exposed
}

interface MemoOptions {
  ttl: number; //in milliseconds
  cacheStrategy: STORAGE_TYPE;
}

interface MemoValue {
  _expiry: number;
  _isObservable: boolean;
  _value: unknown;
}

function getMemoValue(isInMemory: boolean, key: string) {
  return isInMemory
    ? CACHE_MAP.get(key)
    : JSON.parse(localStorage.getItem(key) || 'null');
}

function setMemoValue(isInMemory: boolean, key: string, value: MemoValue) {
  isInMemory
    ? CACHE_MAP.set(key, value)
    : localStorage.setItem(key, JSON.stringify(value));
}

export function MemoFn(options: MemoOptions) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    const isInMemory = options.cacheStrategy === STORAGE_TYPE.IN_MEMORY;

    descriptor.value = function (...args: unknown[]): unknown {
      const key = PREFIX + propertyKey + ':' + JSON.stringify(args);
      const cachedValue = getMemoValue(isInMemory, key);

      if (cachedValue && Date.now() < cachedValue._expiry) {
        return cachedValue._isObservable
          ? of(cachedValue._value)
          : cachedValue._value;
      }

      const result = originalMethod.apply(this, args);

      if (result instanceof Observable) {
        return new Observable((subscriber) => {
          result.subscribe({
            next: (value) => {
              const finalValue = {
                _expiry: Date.now() + options.ttl,
                _isObservable: true,
                _value: value,
              };

              setMemoValue(isInMemory, key, finalValue);
              subscriber.next(value);
            },
            error: (error) => subscriber.error(error),
            complete: () => subscriber.complete(),
          });
        });
      } else {
        const objectResult = {
          _expiry: Date.now() + options.ttl,
          _isObservable: false,
          _value: result,
        };
        setMemoValue(isInMemory, key, objectResult);
        return result;
      }
    };

    return descriptor;
  };
}

export function clear(type: 'expired' | 'all') {
  //clear persistent cache
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);

    if (key?.startsWith(PREFIX)) {
      if (
        type === 'all' ||
        (type === 'expired' &&
          JSON.parse(localStorage.getItem(key) || 'null')?._expiry < Date.now())
      ) {
        localStorage.removeItem(key);
        i--;
      }
    }
  }

  //clear in-memory cache
  if (type === 'all') {
    CACHE_MAP.clear();
  } else {
    CACHE_MAP.forEach((val, key) => {
      if (val._expiry < Date.now()) {
        CACHE_MAP.delete(key);
      }
    });
  }
}
