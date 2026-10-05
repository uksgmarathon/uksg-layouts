import gsap from 'gsap';
import { onScopeDispose, ref, watch } from 'vue';

/**
 * Returns a number that animates towards the source value whenever it changes.
 * Starts at 0, so things like bars "grow" in when they first appear.
 * @param source Getter for the value to follow.
 * @param duration Length of each animation, in seconds.
 * @param delay Delay before the first animation, in seconds.
 */
export function useTweenedNumber(source: () => number, duration = 1.5, delay = 0.3) {
  const value = ref(0);
  const obj = { value: 0 };
  let tween: gsap.core.Tween | undefined;
  let first = true;
  watch(source, (val) => {
    tween?.kill();
    tween = gsap.to(obj, {
      value: val,
      duration,
      delay: first ? delay : 0,
      ease: 'power2.out',
      onUpdate: () => { value.value = obj.value; },
    });
    first = false;
  }, { immediate: true });
  onScopeDispose(() => tween?.kill());
  return value;
}
