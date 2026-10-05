import { cloneDeep, isEqual } from 'lodash-es';
import { computed, ref, watch } from 'vue';

/**
 * Editable local copy of an array replicant, so changes are only applied when "Save" is pressed.
 * The local copy follows the replicant until it has been edited.
 */
export function useDraft<T>(source: () => T[] | undefined) {
  const draft = ref<T[]>([]);
  const dirty = computed(() => !isEqual(draft.value, source() ?? []));
  watch(source, (val) => {
    if (!val) return;
    if (!dirty.value || !draft.value.length) draft.value = cloneDeep(val);
  }, { immediate: true, deep: true });
  const revert = () => { draft.value = cloneDeep(source() ?? []); };
  return { draft, dirty, revert };
}

/**
 * Generates a random ID for new items.
 * Not using crypto.randomUUID as it's unavailable when the dashboard is accessed over plain HTTP on a network.
 */
export function newId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
