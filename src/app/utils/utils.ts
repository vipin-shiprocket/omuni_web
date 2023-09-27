// import { HtmlTagDefinition } from '@angular/compiler';
import { FormGroup } from '@angular/forms';

export const toggleEye = (el: HTMLInputElement): void => {
  if (el.type === 'password') {
    el.type = 'text';
  } else {
    el.type = 'password';
  }
};

export const focusOnFirstDigitInOTP = (): void => {
  //  For focusing First digit Input box
  setTimeout(() => {
    const a = document.querySelectorAll('#digit-1');

    a.forEach((element) => {
      const node = element as HTMLInputElement;
      node?.focus();
      return true;
    });
  }, 300);
};

export const clearOTPForm = (): void => {
  for (let i = 1; i < 7; i++) {
    (<HTMLInputElement>document.getElementById('digit-' + i)).value = '';
  }
};

export const onClearForm = (form: FormGroup): void => {
  form.reset('');
  form.markAsUntouched();
  form.markAsPristine();
};
/**
 * To preload an asset before loading template
 * @param path Path to the asset
 */
export function preloadAsset(path: string, id: string) {
  if (document.getElementById(id)) return;
  const preload = document.createElement('link');
  preload.rel = 'preconnect';
  preload.href = window.location.origin + path;
  preload.id = id;
  document.head.append(preload);
}

export function checkWindowWidth() {
  return window.innerWidth < 768;
}

export function calculateElementHeight(id: string, defaultHeight = 50) {
  const item = document.getElementById(id);
  return item?.offsetHeight || defaultHeight;
}

export function calculateElementTop(id: string, defaultTop = 0) {
  const item = document.getElementById(id);
  return item?.offsetTop || defaultTop;
}

/**
 * Pauses the execution of the function for the specified number of milliseconds.
 *
 * @param ms The number of milliseconds to pause the execution for.
 * @returns A promise that resolves after the specified number of milliseconds have passed.
 */
export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const intervals = new Map<string, number>();

/**
 * @param key clear interval with a key. Clears all intervals if the key is `all`
 */
export function clearIntervals(key: string) {
  if (key === 'all') {
    intervals.forEach((element) => {
      window.clearInterval(element);
    });
    intervals.clear();
  } else if (intervals.has(key)) {
    window.clearInterval(intervals.get(key));
    intervals.delete(key);
  }
}

export function verifyFileType(file: File, fileTypes: string[]) {
  const extension = file.name.substring(file.name.lastIndexOf('.'));
  return fileTypes.includes(file.type) || fileTypes.includes(extension);
}

export function isEmptyObject(obj: unknown) {
  return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
}
