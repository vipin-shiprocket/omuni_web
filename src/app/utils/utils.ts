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
