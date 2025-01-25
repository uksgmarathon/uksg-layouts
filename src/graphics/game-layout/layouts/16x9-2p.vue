<script setup lang="ts">
import ParticipantInfo from '../components/ParticipantInfo.vue';
import RunInfo from '../components/RunInfo.vue';
import TimerElem from '../components/TimerElem.vue';
</script>

<template>
  <div>
    <RunInfo :class="$style.RunInfo" flipped subtitle-font-size="22px" />
    <TimerElem class="BorderBottom" :class="$style.Timer" estimate-size="24px" timer-size="80px" />
    <!-- Game Feeds -->
    <div id="Game1" class="Fixed Capture BorderTop BorderRight BorderBottom" :class="$style.GameFeed1" />
    <div id="Game2" class="Fixed Capture BorderTop BorderLeft BorderBottom" :class="$style.GameFeed2" />
    <!-- Camera Feed -->
    <div id="Camera" class="Fixed Capture BorderTop BorderLeft BorderRight" :class="$style.CameraFeed" />
    <!-- Runners/Players -->
    <ParticipantInfo :class="$style.Player1" name-font-size="30px" type="player" :index="0" />
    <ParticipantInfo :class="$style.Player2" name-font-size="30px" type="player" :index="1" />
    <!-- Host -->
    <ParticipantInfo
      :class="$style.Host"
      type="host"
      header-colour="#0c3f6b"
      header-text="Host"
      header-font-size="14px"
      header-width="66px"
      name-font-size="22px"
      cut-edge-size="8px"
    />
    <!-- Comm1 -->
    <ParticipantInfo
      :class="$style.Comm1"
      type="comm1"
      header-colour="#055255"
      header-text="Comm"
      header-font-size="14px"
      header-width="66px"
      name-font-size="22px"
      cut-edge-size="8px"
    />
    <!-- Comm2 -->
    <ParticipantInfo
      :class="$style.Comm2"
      type="comm2"
      header-colour="#055255"
      header-text="Comm"
      header-font-size="14px"
      header-width="66px"
      name-font-size="22px"
      cut-edge-size="8px"
    />
  </div>
</template>

<style lang="scss" module>
.RunInfo {
  z-index: 1;
  left: 0px;
  top: 0px;
  width: 1124px;
  height: 144px;
}

.Timer {
  left: 1124px;
  top: 0px;
  width: 796px;
  height: 144px;
}

.GameFeed1 {
  left: 0px;
  top: 141px;
  width: 960px;
  height: 544px;
}

.GameFeed2 {
  left: 957px;
  top: 141px;
  width: 963px;
  height: 544px;
}

.CameraFeed {
  left: 614px;
  top: 682px;
  width: 692px;
  height: 318px;
}

.Player1 {
  left: 0px;
  top: 682px;
  width: 617px;
  height: 81px;
}

.Player2 {
  left: 1303px;
  top: 682px;
  width: 617px;
  height: 81px;
}

.Host {
  left: 0px;
  top: 760px;
  width: 480px;
  height: 54px;
}

.Comm1 {
  left: 0px;
  top: 811px;
  width: 480px;
  height: 55px;
}

.Comm2 {
  left: 0px;
  top: 862px;
  width: 480px;
  height: 55px;
}
</style>
