export const toggleEye = (el: HTMLInputElement) => {
  if (el.type === 'password') {
    el.type = 'text';
  } else {
    el.type = 'password';
  }
};

export function preloadImage(path: string) {
  const preload = document.createElement('link');
  preload.rel = 'preconnect';
  preload.href = window.location.origin + path;
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
