<script setup lang="ts">
import { isValidColour, presetColours } from '../../browser_shared/customisation';

/**
 * Colour picker with some quick preset swatches; an empty value means "use the default".
 */
withDefaults(defineProps<{
  label: string,
  placeholder?: string,
}>(), {
  placeholder: undefined,
});
const model = defineModel<string | undefined>();
</script>

<template>
  <div>
    <QInput
      :model-value="model ?? ''"
      :label="label"
      :placeholder="placeholder"
      :stack-label="!!placeholder"
      dense
      square
      outlined
      clearable
      debounce="500"
      :error="!!model && !isValidColour(model)"
      error-message="Use a hex colour, e.g. #f5c400"
      @update:model-value="(val) => { model = (val as string | null)?.trim() || undefined; }"
    >
      <template #prepend>
        <div
          :class="$style.Preview"
          :style="{ background: model || placeholder || 'transparent' }"
        />
      </template>
      <template #append>
        <QIcon
          name="colorize"
          class="cursor-pointer"
        >
          <QPopupProxy
            cover
            transition-show="scale"
            transition-hide="scale"
          >
            <QColor
              :model-value="model ?? placeholder ?? '#44a0e3'"
              format-model="hex"
              no-header-tabs
              @change="(val: string) => { model = val; }"
            />
          </QPopupProxy>
        </QIcon>
      </template>
    </QInput>
    <div :class="$style.Swatches">
      <button
        v-for="colour in presetColours"
        :key="colour"
        type="button"
        :class="{ [$style.Swatch]: true, [$style.Selected]: model?.toLowerCase() === colour }"
        :style="{ background: colour }"
        :title="colour"
        @click="model = colour"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.Preview {
  width: 20px;
  height: 20px;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.Swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding-top: 4px;
}

.Swatch {
  width: 22px;
  height: 22px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
}

.Selected {
  outline: 2px solid white;
  outline-offset: 1px;
}
</style>
