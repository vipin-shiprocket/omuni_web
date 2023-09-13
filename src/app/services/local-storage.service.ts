import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  // prefix = 'ngStorage-';

  set(key: string, value: string) {
    // this.prefix = prefix ?? this.prefix;
    localStorage.setItem(key, value);
  }

  get(key: string) {
    // this.prefix = prefix ?? this.prefix;
    return localStorage.getItem(key);
  }

  clear() {
    localStorage.clear();
  }

  remove(key: string) {
    // this.prefix = prefix ?? this.prefix;
    localStorage.removeItem(key);
    // localStorage.removeItem(`${this.prefix}${key}`);
  }

  len() {
    return localStorage.length;
  }
}
