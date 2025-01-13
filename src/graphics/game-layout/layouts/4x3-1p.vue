<script setup lang="ts">
import ParticipantInfo from '../components/ParticipantInfo.vue';
import RunInfo from '../components/RunInfo.vue';
import TimerElem from '../components/TimerElem.vue';
</script>

<template>
  <div>
    <RunInfo :class="$style.RunInfo" />
    <TimerElem class="BorderRight BorderBottom" :class="$style.Timer" />
    <!-- Camera Feed -->
    <div class="Fixed Capture BorderRight" :class="$style.CameraFeed" />
    <!-- Runner/Player -->
    <ParticipantInfo :class="$style.Player" />
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
    <!-- Game Feed -->
    <div class="Fixed Capture BorderLeft" :class="$style.GameFeed" />
  </div>
</template>

<style lang="scss" module>
.RunInfo {
  /* Putting some of the border outside visible space. */
  left: -3px;
  top: -3px;
  width: 593px; /* 3px added because of above */
  height: 165px; /* 3px added because of above */
}

.Timer {
  left: 0px;
  top: 162px;
  width: 590px;
  height: 97px;
}

.Player {
  left: 0px;
  top: 561px;
  width: 590px;
  height: 73px;
}

.Host {
  left: 0px;
  top: 631px;
  width: 590px;
  height: 46px;
}

.Comm1 {
  left: 0px;
  top: 674px;
  width: 590px;
  height: 46px;
}

.Comm2 {
  left: 0px;
  top: 717px;
  width: 590px;
  height: 46px;
}

.CameraFeed {
  left: 0px;
  top: 259px;
  width: 590px;
  height: 302px;
}

.GameFeed {
  left: 587px;
  top: 0px;
  width: 1333px;
  height: 1000px;
}
</style>
