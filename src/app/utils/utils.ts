export const toggleEye = (el: HTMLInputElement) => {
  if (el.type === 'password') {
    el.type = 'text';
  } else {
    el.type = 'password';
  }
};
