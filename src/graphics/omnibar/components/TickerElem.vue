<script setup lang="ts">
</script>

<template>
  <div
    class="Flex"
    :class="$style.Wrapper"
  >
    <div
      class="Flex"
      :class="$style.Text"
    >
      You are watching UKSG RED 2026!
    </div>
    <div :class="$style.Divider" />
    <div
      class="Flex"
      :class="$style.Text"
    >
      Donate @ donate.uksgmarathon.uk
    </div>
  </div>
</template>

<style lang="scss" module>
.Wrapper {
  height: 100%;
  font-size: 24px;
  font-weight: 500;
  flex: 1;
}

.Divider {
  width: 3px;
  height: 100%;
  background-color: #2f6f9d; /* Different colour than other borders! */
}

.Text {
  flex: 1;
}
</style>
