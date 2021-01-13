<template>
  <div class="playfullFooter">
    <span class="time1"> {{ currentTime | filtertime }}</span>
    <div class="progress">
      <input
        type="range"
        :max="duration"
        step="1"
        :value="currentTime"
        @input="getValue"
      />
      <span
        class="pro"
        :style="{ width: (currentTime / duration) * 100 + '%' }"
      ></span>
    </div>
    <span class="time2"> {{ duration | filtertime }}</span>

    <br />
    <div class="station">
      <ul class="list">
        <li class="item" @click="$emit('update-round')">
          <img src="../assets/goback.svg" />
        </li>

        <li class="item" @click="$emit('update-last')">
          <img src="../assets/last.svg" />
        </li>

        <li class="item" @click="$emit('update-paused')">
          <img src="../assets/stopicon.svg" v-show="!paused" />
          <img src="../assets/readicon.svg" v-show="paused" />
        </li>
        <!-- <li class="item"></li> -->

        <li class="item" @click="$emit('update-next')">
          <img src="../assets/next.svg" />
        </li>
        <li class="item"><img src="../assets/playlist.svg" /></li>
      </ul>
      <!-- <button @click="$emit('update-last')">上一首</button>
      <button @click="$emit('update-paused')">icon</button>
      <button @click="$emit('update-next')">下一首</button> -->
    </div>
  </div>
</template>

<script>
export default {
  props: ["duration", "currentTime", "paused"],
  data() {
    return {
      flag: true
    };
  },
  filters: {
    filtertime: function(value) {
      var min = parseInt(value / 60);
      min = min < 10 ? "0" + min : min;
      var s = parseInt(value % 60);
      s = s < 10 ? "0" + s : s;
      // console.log(min, s);
      return min + ":" + s;
    }
  },

  methods: {
    getValue(e) {
      this.$emit("update:currentTime", e.target.value);
    }
  }
};
</script>

<style lang="less" scoped>
.playfullFooter {
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  z-index: 12;
  background: linear-gradient(
    to right,
    rgb(56, 56, 56),
    rgb(46, 19, 19),
    rgb(56, 56, 56)
  );
  .time1 {
    position: absolute;
    color: white;
    top: -5px;
    left: 0;
    font-size: 10px;
  }
  .time2 {
    position: absolute;
    top: -5px;
    right: 0;
    color: white;
    font-size: 10px;
  }
  .progress {
    width: 80%;
    height: 3px;
    background-color: whitesmoke;
    // background: linear-gradient(to right, lightblue, lightcoral);
    position: relative;
    top: 0;
    left: 0;
    margin: 0 auto;
    border-radius: 3px;
    input {
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      opacity: 0;
    }
    span.pro {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 0%;
      height: 100%;
      background: rgb(91, 121, 94);
      border-radius: 3px;
      &::after{
          content: "";
          width: 5px;
          height: 5px;
          border-radius: 50%;
          float: right;
          background-color:  rgb(184, 196, 184);
      }
    }
  }
  .station {
    width: 100%;
    height: 30px;
    margin-bottom: 14px;
    .list {
      display: flex;
      .item {
        flex: 1;
        justify-content: space-around;
        // background-color: #ffffff;
        text-align: center;
        img {
          height: 20px;
          width: 20px;
          background-size: cover;
          margin: auto;
        }
      }
    }
  }
}
</style>