const supportedKeys = new Set([
  'z',
  's',
  'q',
  'd',
  'arrowup',
  'arrowdown',
  'arrowleft',
  'arrowright',
]);

export function createControls() {
  const pressedKeys = new Set();

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (supportedKeys.has(key)) {
      event.preventDefault();
      pressedKeys.add(key);
    }
  });

  window.addEventListener('keyup', (event) => {
    pressedKeys.delete(event.key.toLowerCase());
  });

  window.addEventListener('blur', () => pressedKeys.clear());

  return {
    get throttle() {
      return (
        Number(pressedKeys.has('z') || pressedKeys.has('arrowup')) -
        Number(pressedKeys.has('s') || pressedKeys.has('arrowdown'))
      );
    },
    get steering() {
      return (
        Number(pressedKeys.has('d') || pressedKeys.has('arrowright')) -
        Number(pressedKeys.has('q') || pressedKeys.has('arrowleft'))
      );
    },
  };
}
