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

export const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
