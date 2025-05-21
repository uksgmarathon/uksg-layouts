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
      class="Fixed Capture BorderTop BorderRight BorderBottom"
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
    <!-- Game Feeds -->
    <div
      id="Game1"
      class="Fixed Capture BorderLeft BorderBottom"
      :class="$style.GameFeed1"
    />
    <div
      id="Game2"
      class="Fixed Capture BorderRight BorderBottom"
      :class="$style.GameFeed2"
    />
    <TimerElem
      class="BorderLeft BorderTop"
      :class="$style.Timer"
      vertical
      timer-size="70px"
    />
    <RunInfo :class="$style.RunInfo" />
  </div>
</template>

<style lang="scss" module>
.CameraFeed {
  left: 0px;
  top: 360px;
  width: 480px;
  height: 222px;
}

.Player {
  left: 0px;
  top: 579px;
  width: 480px;
  height: 81px;
}

.Host {
  left: 0px;
  top: 657px;
  width: 480px;
  height: 54px;
}

.Comm1 {
  left: 0px;
  top: 708px;
  width: 480px;
  height: 54px;
}

.Comm2 {
  left: 0px;
  top: 759px;
  width: 480px;
  height: 54px;
}

.ImageRotation {
  left: 0px;
  top: 813px;
  width: 477px;
  height: 187px;
}

.GameFeed1 {
  left: 477px;
  top: 0px;
  width: 1443px;
  height: 866px;
}

.GameFeed2 {
  left: 0px;
  top: 0px;
  width: 480px;
  height: 363px;
}

.Timer {
  left: 477px;
  top: 863px;
  width: 706px;
  height: 137px;
}

.RunInfo {
  left: 1183px;
  top: 863px;
  width: 737px;
  height: 140px;
}
</style>
