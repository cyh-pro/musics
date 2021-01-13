<template>
  <div @click="$emit('toggle-show-lyric')" class="show-Chart">
    <div class="m-song-turn">
      <div class="m-song-rollwrap" :class="{ paused: paused }">
        <div class="m-song-img ">
          <!-- <img :src="currentMusic.picUrl || currentMusic.al.picUrl || currentMusic.album.picUrl" /> -->

          <img
            :src="currentMusic.picUrl || currentMusic.al.picUrl"
            :class="{ paused: paused }"
          />
        </div>
      </div>

      <div class="m-song-lgour" :class="{ paused: paused }">
        <div class="m-song-light " :class="{ paused: paused }"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["currentMusic", "paused", "duration", "currentTime"]
};
</script>

<style scoped lang='less'>
.show-Chart {
  position: absolute;
  z-index: 99;
  width: 100%;
  .m-song-turn {
    position: relative;
    width: 248px;
    height: 248px;
    margin: 100px auto;
    &::before {
      content: " ";
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 2;
      background: url("../assets/disc.png") no-repeat;
      background-size: contain;
    }
    &.paused {
      animation-play-state: paused;
    }

    .m-song-rollwrap {
      position: absolute;
      width: 150px;
      height: 150px;
      left: 50%;
      top: 50%;
      z-index: 1;
      margin: -75px 0 0 -75px;
      .m-song-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;

        img {
          width: 100%;
          height: 100%;
          background-size: cover;

          animation: playing 6s linear infinite;
          &.paused {
            animation-play-state: paused;
          }
        }
      }
    }
    .m-song-lgour,
    .m-song-light {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 3;
      animation: playing 8s linear infinite;
      &.paused {
        animation-play-state: paused;
      }
    }
    .m-song-light {
      background: url("../assets/disc_light.png") no-repeat;
      background-size: contain;
    }
  }
}

@keyframes playing {
  form {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>