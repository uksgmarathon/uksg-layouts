import { cloneDeep, isEqual } from 'lodash-es';
import { computed, ref, watch, type Ref } from 'vue';

/**
 * Editable local copy of an array replicant, so changes are only applied when "Save" is pressed.
 * The local copy follows the replicant (including other people's saves) until it has been edited.
 * @param source Gets the replicant's current value.
 * @param commit Writes the draft back to the replicant.
 */
export function useDraft<T>(source: () => T[] | undefined, commit: (draft: T[]) => void) {
  const draft = ref([]) as Ref<T[]>;
  // What the draft was last copied from, to tell if it has been edited since.
  let base: T[] = [];
  const dirty = computed(() => !isEqual(draft.value, source() ?? []));
  watch(source, (val) => {
    if (!val) return;
    if (isEqual(draft.value, base)) draft.value = cloneDeep(val);
    base = cloneDeep(val);
  }, { immediate: true, deep: true });
  const revert = () => { draft.value = cloneDeep(source() ?? []); };
  const save = () => {
    commit(draft.value);
    revert();
  };
  return { draft, dirty, revert, save };
}

/**
 * Generates a random ID for new items.
 * Not using crypto.randomUUID as it's unavailable when the dashboard is accessed over plain HTTP on a network.
 */
export function newId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
