<script setup lang="ts">
import ParticipantInfo from '../components/ParticipantInfo.vue';
import RunInfo from '../components/RunInfo.vue';
import TimerElem from '../components/TimerElem.vue';
</script>

<template>
  <div>
    <RunInfo :class="$style.RunInfo" />
    <TimerElem class="BorderBottom" :class="$style.Timer" />
    <!-- Game Feeds -->
    <div class="Fixed Capture BorderAll" :class="$style.GameFeed1" />
    <div class="Fixed Capture BorderAll" :class="$style.GameFeed2" />
    <!-- Camera Feed -->
    <div class="Fixed Capture BorderTop BorderLeft BorderRight" :class="$style.CameraFeed" />
    <!-- Runners/Players -->
    <ParticipantInfo :class="$style.Player1" />
    <ParticipantInfo :class="$style.Player2" />
    <!-- Host -->
    <ParticipantInfo
      :class="$style.Host"
      header-colour="#0c3f6b"
      header-text="Host"
      header-font-size="14px"
      header-width="66px"
      name-font-size="20px"
      cut-edge-size="8px"
    />
    <!-- Comm1 -->
    <ParticipantInfo
      :class="$style.Comm1"
      header-colour="#055255"
      header-text="Comm"
      header-font-size="14px"
      header-width="66px"
      name-font-size="20px"
      cut-edge-size="8px"
    />
    <!-- Comm2 -->
    <ParticipantInfo
      :class="$style.Comm2"
      header-colour="#055255"
      header-text="Comm"
      header-font-size="14px"
      header-width="66px"
      name-font-size="20px"
      cut-edge-size="8px"
    />
  </div>
</template>

<style lang="scss" module>
.RunInfo {
  z-index: 1;
  left: 0px;
  top: 0px;
  width: 1270px;
  height: 97px;
}

.Timer {
  left: 1270px;
  top: 0px;
  width: 650px;
  height: 97px;
}

.GameFeed1 {
  left: 72px;
  top: 94px;
  width: 891px;
  height: 666px;
}

.GameFeed2 {
  left: 960px;
  top: 94px;
  width: 889px;
  height: 666px;
}

.Player1 {
  left: 0px;
  top: 757px;
  width: 662px;
  height: 81px;
}

.Player2 {
  left: 1258px;
  top: 757px;
  width: 662px;
  height: 81px;
}

.Host {
  left: 0px;
  top: 835px;
  width: 480px;
  height: 48px;
}

.Comm1 {
  left: 0px;
  top: 880px;
  width: 480px;
  height: 49px;
}

.Comm2 {
  left: 0px;
  top: 924px;
  width: 480px;
  height: 49px;
}

.CameraFeed {
  left: 659px;
  top: 757px;
  width: 602px;
  height: 243px;
}
</style>
