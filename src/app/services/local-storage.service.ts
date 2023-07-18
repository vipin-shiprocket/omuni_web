import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  prefix = 'ngStorage-';

  set(key: string, value: string, prefix?: string) {
    this.prefix = prefix ?? this.prefix;
    localStorage.setItem(`${this.prefix}${key}`, value);
  }

  get(key: string, prefix?: string) {
    this.prefix = prefix ?? this.prefix;
    return localStorage.getItem(`${this.prefix}${key}`);
  }

  clear() {
    localStorage.clear();
  }

  remove(key: string, prefix?: string) {
    this.prefix = prefix ?? this.prefix;
    localStorage.removeItem(`${this.prefix}${key}`);
  }

  len() {
    return localStorage.length;
  }
}
