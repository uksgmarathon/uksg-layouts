import { nextTick, onMounted, ref, watch, type Ref, type WatchSource } from 'vue';

/**
 * Checks if an element's content doesn't fit in the space it's been given, so a layout can
 * switch to "stacking" things on separate lines instead of cutting text off.
 * The element should have a minimum width of 0 so it shrinks rather than pushing other things.
 * @param elem Element to check.
 * @param source Re-checks whenever this changes (e.g. the text inside it).
 */
export function useStacked(elem: Ref<HTMLElement | undefined>, source?: WatchSource) {
  const stacked = ref(false);
  async function check() {
    // Always measure in the normal (unstacked) layout; no paint happens in between.
    stacked.value = false;
    await nextTick();
    await document.fonts.ready;
    stacked.value = !!elem.value && elem.value.scrollWidth > elem.value.clientWidth + 1;
  }
  onMounted(() => { check().catch(() => { /* ignore */ }); });
  if (source) watch(source, () => { check().catch(() => { /* ignore */ }); }, { deep: true });
  return stacked;
}
