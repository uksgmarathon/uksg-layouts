import gsap from 'gsap';
import { onMounted, onScopeDispose, type Ref } from 'vue';

/**
 * If some content is wider than its container, slowly scrolls it to the end,
 * pauses, then jumps back to the start and repeats.
 * @param container Element that has the overflow hidden.
 * @param content Element inside of the container that is scrolled.
 * @param speed Scroll speed in pixels per second.
 * @param measureDelay How long to wait (in milliseconds) before measuring, so any entrance animations have finished.
 */
export function useMarquee(
  container: Ref<HTMLElement | undefined>,
  content: Ref<HTMLElement | undefined>,
  speed = 90,
  measureDelay = 800,
) {
  let tl: gsap.core.Timeline | undefined;
  onMounted(() => {
    // Wait for the item to finish transitioning in so the measurements are correct.
    window.setTimeout(() => {
      if (!container.value || !content.value) return;
      const overflow = content.value.scrollWidth - container.value.clientWidth;
      if (overflow <= 0) return;
      tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })
        .to(content.value, { x: -overflow, duration: overflow / speed, ease: 'none', delay: 2.5 })
        .to(content.value, { opacity: 0, duration: 0.3, delay: 2.5 })
        .set(content.value, { x: 0 })
        .to(content.value, { opacity: 1, duration: 0.3 });
    }, measureDelay);
  });
  onScopeDispose(() => tl?.kill());
}
