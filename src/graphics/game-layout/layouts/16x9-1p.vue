<script setup lang="ts">
import ImageRotation from '../../_misc/components/ImageRotation.vue';
import ParticipantInfo from '../components/ParticipantInfo.vue';
import RunInfo from '../components/RunInfo.vue';
import TimerElem from '../components/TimerElem.vue';
</script>

<template>
  <div>
    <!-- Camera Feed -->
    <div
      id="Camera"
      class="Fixed Capture BorderRight BorderBottom"
      :class="$style.CameraFeed"
    />
    <!-- Runner/Player -->
    <ParticipantInfo
      :class="$style.Player"
      header-font-size="18px"
      type="player"
    />
    <!-- Host -->
    <ParticipantInfo
      :class="$style.Host"
      type="host"
      header-font-size="14px"
      header-width="66px"
      name-font-size="20px"
      cut-edge-size="8px"
    />
    <!-- Comm1 -->
    <ParticipantInfo
      :class="$style.Comm1"
      type="comm1"
      header-font-size="14px"
      header-width="66px"
      name-font-size="20px"
      cut-edge-size="8px"
    />
    <!-- Comm2 -->
    <ParticipantInfo
      :class="$style.Comm2"
      type="comm2"
      header-font-size="14px"
      header-width="66px"
      name-font-size="20px"
      cut-edge-size="8px"
    />
    <ImageRotation
      class="Fixed"
      :class="$style.ImageRotation"
    />
    <!-- Game Feed -->
    <div
      id="Game1"
      class="Fixed Capture BorderLeft BorderBottom"
      :class="$style.GameFeed"
    />
    <TimerElem
      class="BorderLeft BorderTop"
      :class="$style.Timer"
      vertical
      timer-size="80px"
    />
    <RunInfo :class="$style.RunInfo" />
  </div>
</template>

<style lang="scss" module>
.CameraFeed {
  left: 0px;
  top: 0px;
  width: 480px;
  height: 369px;
}

.Player {
  left: 0px;
  top: 366px;
  width: 480px;
  height: 81px;
}

.Host {
  left: 0px;
  top: 444px;
  width: 480px;
  height: 54px;
}

.Comm1 {
  left: 0px;
  top: 495px;
  width: 480px;
  height: 54px;
}

.Comm2 {
  left: 0px;
  top: 546px;
  width: 480px;
  height: 54px;
}

.ImageRotation {
  left: 0px;
  top: 600px;
  width: 477px;
  height: 400px;
}

.GameFeed {
  left: 477px;
  top: 0px;
  width: 1443px;
  height: 814px;
}

.Timer {
  left: 477px;
  top: 811px;
  width: 706px;
  height: 192px;
}

.RunInfo {
  left: 1183px;
  top: 811px;
  width: 737px;
  height: 192px;
}
</style>
