import { onScopeDispose, ref } from 'vue';

/**
 * Reactive "current time" that updates on an interval.
 * @param interval How often to update, in milliseconds.
 */
export function useNow(interval = 5000) {
  const now = ref(Date.now());
  const handle = window.setInterval(() => { now.value = Date.now(); }, interval);
  onScopeDispose(() => window.clearInterval(handle));
  return now;
}
