<template>
  <div id="app">
    <div class="loading" v-show="$parent.isShowLoading">
      <svg width="30" height="30" viewBox="0 0 100 100">
        <path
          fill="#FF6700"
          d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"
          transform="rotate(275.098 25 25)"
        >
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="0.6s"
            repeatCount="indefinite"
          ></animateTransform>
        </path>
      </svg>
    </div>
    <Play
      v-if="currentMusic"
      :currentMusic="currentMusic"
      :playlist="playlist"
      :lyric="lyric"
      v-bind:paused="paused"
      :currentIndex="currentIndex"
      @updata:paused="paused = $event"
      @update:music="
        currentMusic = $event.item;
        currentIndex = $event.index;
      "
    />
    <HomeNav v-if="$route.meta.isShowNav" />

    <keep-alive>
      <router-view
        @update:music="
          currentMusic = $event.item;
          currentIndex = $event.index;
        "
        @update:playlist="playlist = $event"
        v-bind:currentMusic="currentMusic"
        v-bind:paused="paused"
      />
    </keep-alive>
  </div>
</template>
<script>
import HomeNav from "@/components/HomeNav.vue";
import Play from "@/components/Play.vue";
export default {
  components: {
    HomeNav,
    Play
  },
  data() {
    return {
      currentMusic: null,
      paused: null,
      playlist: [],
      currentIndex: 0,
      lyric: null
    };
  },
  watch: {
    currentMusic: function() {
      this.axios.get("/lyric?id=" + this.currentMusic.id).then(response => {
        if (response.data.lrc) {
          let lyric = response.data.lrc.lyric;
          this.lyric = this.paresLyric(lyric);
        }
      });
    }
  },
  methods: {
    paresLyric(lyric) {
      var patt = /\[\d{2}:\d{2}\.\d{2,3}\]/gi;
      var arr = lyric
        .split("\n")
        .filter(e => e)
        .map(str => {
          var time = str.match(patt)[0].replace(/(\[|\])/gi, "");
          var timeArr = time.split(":");
          time = Number(timeArr[0]) * 60 + Number(timeArr[1]);
          var text = str.replace(patt, "");
          return { time, text };
        });
      return arr;
    }
  }
};
</script>
<style lang='less'>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
:root {
  --animate-duration: 300ms;
  /* --animate-delay: 0.9s; */
}
.loading {
  width: 100%;
  height: 100vh;
  position: fixed;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    animation: loading 3s linear infinite;
  }
}
@keyframes loading {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
