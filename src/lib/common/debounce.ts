export function debounce(fn: any, time: number) {
  let timeoutId: NodeJS.Timeout | string | number | null;
  return wrapper;
  function wrapper(...props: any) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...props);
    }, time);
  }
}
