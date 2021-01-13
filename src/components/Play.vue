<template>
  <div class="play" :class="{ paused: paused }">
    <audio
    v-if=" currentMusic.id"
      :src="
        'https://music.163.com/song/media/outer/url?id=' +
          currentMusic.id +
          '.mp3'
      "
      autoplay
      style="width: 100%; height: 40px"
      ref="audio"
    ></audio>
    <transition
      name="custom-classes-transition"
      enter-active-class="animate__animated animate__slideInUp"
      leave-active-class="animate__animated animate__slideOutDown"
    >
      <div
        class="play-bar"
        v-show="isShowPlayBar"
        @click="isShowPlayBar = false"
      >
        <img :src="picUrl" />
        <div class="text">
          <h5>{{ currentMusic.name }}</h5>
          <h6>{{ singers }}</h6>
        </div>

        <div class="control" @click.stop="togglePlayState">
          <canvas ref="circle" width="50" height="50" v-if="drawCircle"></canvas>
          <span class="icon"></span>
        </div>
      </div>
    </transition>

    <transition
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div class="play-full" v-if="!isShowPlayBar">
        <div
          class="mask"
          :style="{ backgroundImage: `url('${picUrl}')` }"
        ></div>

        <PlayFullHeader
          @show-play-bar="isShowPlayBar = true"
          :currentMusic="currentMusic"
          :singers="singers"
        />
        <template>
          <PlayFullLyric
            v-if="isShowLyric"
            @toggle-show-lyric="isShowLyric = !isShowLyric"
            :currentMusic="currentMusic"
            v-bind:currentTime="currentTime"
            v-bind:duration="duration"
            :lyric="$attrs.lyric"
             @update:currentTime="$refs.audio.currentTime = $event"
          />
          <PlayFullChart
            v-else
            @toggle-show-lyric="isShowLyric = !isShowLyric"
            :currentMusic="currentMusic"
            :paused="$attrs.paused"
            v-bind:currentTime="currentTime"
            v-bind:duration="duration"
          />
        </template>
        <PlayFullFooter
          v-bind:currentTime="currentTime"
          v-bind:duration="duration"
          v-bind:paused="paused"
          @update-last="playlast"
          @update-next="playnext"
           @update-round="playrandom"
          @update-paused="togglePlayState"
          @update:currentTime="$refs.audio.currentTime = $event"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import PlayFullHeader from "@/components/PlayFullHeader.vue";
import PlayFullChart from "@/components/PlayFullChart.vue";
import PlayFullLyric from "@/components/PlayFullLyric.vue";
import PlayFullFooter from "@/components/PlayFullFooter.vue";
export default {
  props: ["currentMusic", "playlist", "currentIndex"],
  components: {
    PlayFullHeader,
    PlayFullChart,
    PlayFullLyric,
    PlayFullFooter
  },
  data() {
    return {
      paused: null,
      isShowLyric: false,
      isShowPlayBar: true,
      duration: 0,
      currentTime: 0
    };
  },
  created() {},
  computed: {
    singers() {
      let singarr = [];
      if (this.currentMusic.song) {
        this.currentMusic.song.artists.forEach(element => {
          singarr.push(element.name);
        });
      }else{
         this.currentMusic.ar.forEach(element => {
          singarr.push(element.name);
        });
      }
      // if (this.currentMusic.ar) {
      //   this.currentMusic.ar.forEach(element => {
      //     singarr.push(element.name);
      //   });
      // }

      return singarr.join("/");
    },
    picUrl() {
      let picUrlarr = "";
      if (this.currentMusic.al) {
        picUrlarr = this.currentMusic.al.picUrl;
      } else {
        picUrlarr = this.currentMusic.picUrl;
      }

      return picUrlarr;
    }
    
  },
  mounted() {
    // console.log("mounted", this.$refs.audio);
    // console.log(this.$refs.audio);
    const audio = this.$refs.audio;
    audio.addEventListener("pause", () => {
      this.paused = true;
    });
    audio.addEventListener("play", () => {
      this.paused = false;
    });
    audio.addEventListener("durationchange", () => {
      this.duration = audio.duration;
    });
    audio.addEventListener("timeupdate", () => {
      this.currentTime = audio.currentTime;
      this.drawCircle(this.currentTime, this.duration);
    });
    audio.addEventListener("ended", () => {
      // console.log("ended");
      this.playnext();
    });
  },
  watch: {
    paused(n) {
      this.$emit("updata:paused", n);
    }
  },

  methods: {
    lang() {
      if (this.intervalId != null) return;
      this.intervalId = setInterval(() => {
        var start = this.currentMusic.name.substring(0, 1);
        // 获取到 后面的所有字符
        var end = this.currentMusic.name.substring(1);
        // 重新拼接得到新的字符串，并赋值给 this.msg
        this.currentMusic.name = end + start;
      }, 1000);
    },
    stop() {
      // 停止定时器
      clearInterval(this.intervalId);
      // 每当清除了定时器之后，需要重新把 intervalId 置为 null
      this.intervalId = null;
    },

    drawCircle(n, total) {
      let canvas = this.$refs.circle;
      let ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, 50, 50);
      ctx.beginPath();
      ctx.strokeStyle = "rgba(62, 62, 62, 0.3)";
      ctx.arc(25, 25, 17, 0, Math.PI * 2, false); // 绘制
      ctx.stroke();
      ctx.closePath();

      ctx.beginPath();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
      ctx.lineWidth = "2";
      ctx.arc(
        25,
        25,
        17,
        Math.PI * -0.5,
        Math.PI * ((n / total) * 2 - 0.5),
        false
      ); // 绘制
      ctx.stroke();
      ctx.closePath();
    },
    togglePlayState: function() {
      let audio = this.$refs.audio;
      if (this.paused) {
        audio.play();
        // this.lang()
      } else {
        audio.pause();
        // this.stop()
      }
    },

    calculateNext() {
      let nextIndex;
      if (this.currentIndex < this.playlist.length - 1) {
        nextIndex = this.currentIndex + 1;
      } else {
        nextIndex = 0;
      }

      return nextIndex;
    },
      calculaterandom() {
      let randomNum
      do{
        randomNum= Math.floor(Math.random()*(this.playlist.length) )
      }while(randomNum===this.currentIndex)
      console.log(randomNum)
     

      return randomNum;
    },
    playrandom() {
      console.log("下一曲");
      let index = this.calculaterandom();
      // console.log(index)
      this.$emit("update:music", {
        item: this.playlist[index],
        index
      });
    },
    calculateLast() {
      let lastIndex;
      if (this.currentIndex >0) {
        lastIndex = this.currentIndex - 1;
      } else {
        lastIndex =this.playlist.length - 1;
      }

      return lastIndex;
    },
    playlast() {
      console.log("上一曲");
      let index = this.calculateLast();
      // console.log(index)
      this.$emit("update:music", {
        item: this.playlist[index],
        index
      });
    },
    playnext() {
      console.log("下一曲");
      let index = this.calculateNext();
      // console.log(index)
      this.$emit("update:music", {
        item: this.playlist[index],
        index
      });
    }
  }
};
</script>

<style scope lang="less" >
.play {
  &.paused {
    .play-bar {
      img {
        animation-play-state: paused;
      }
      .control {
        span.icon {
          &::before {
            content: "";
            display: block;
            height: 25px;
            width: 25px;
            background: url(../assets/play.svg);
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: center;
          }
        }
      }
    }
  }
}
.play-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 9;
  background-color: white;
  width: 100%;
  display: flex;

  img {
    width: 36px;
    height: 36px;
    margin: 7px;
    border-radius: 50%;
    animation: play 6s linear infinite;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.15);
  }
  .text {
    flex: 0 1 220px;
    overflow: hidden;
    h5 {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    h6 {
      margin-left: 5px;
      font-size: 14px;
      color: #888;
    }
  }
  .control {
    flex: 0 0 50px;
    position: relative;
    span {
      position: absolute;
      top: 13px;
      left: 13.5px;
      width: 100%;
      height: 100%;
      &::before {
        content: "";
        display: block;
        height: 25px;
        width: 25px;
        background: url(../assets/stop.svg);
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
      }
    }
  }
}
.play-full {
  background: linear-gradient(
    to right,
    rgb(56, 56, 56),
    rgb(95, 95, 95),
    rgb(56, 56, 56)
  );

  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9;
  .mask {
    background: url("http://p1.music.126.net/fwXShM46KdIj3hB8_lJ71g==/109951165545588869.jpg");
    background-size: cover;
    background-position: center;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    filter: blur(30px) brightness(0.5);
  }
}
@keyframes play {
  form {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>