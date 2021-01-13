<template>
  <div @click="$emit('toggle-show-lyric')" class="show-lyric">
    <div class="lyricMoves" :style="{ marginTop: lyricMove }">
      <ul @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
        <li
          v-for="(item, index) in lyric"
          :key="index"
          items="item"
          :style="{
            'font-size': index == currentRow ? '1.3rem' : '.9rem',
            color: index == currentRow ? 'white' : '#b59b9b'
          }"
        >
          <div>{{ item.text || "----" }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: ["currentMusic", "lyric", "currentTime"],
  data() {
    return {
      currentRow: 0,
      lyricMove: 0,
      scorllY: 0
    };
  },
  watch: {
    currentTime: function() {
      if (this.lyric) {
        this.lyric.forEach((element, index) => {
          if (this.currentTime > element.time) {
            this.currentRow = index ; //通过比较我们歌词属性里的时间与当前播放时间，来定位到该歌词
            this.lyricMove = -(index) * 30 + 200 + "px";
          }
        });
      }
    }
  },
  methods: {
    touchstart: function(e) {
      // console.log('touchstart',e.touches[0].clientY);
      this.touching = true;
      this.y = e.touches[0].clientY;
    },
    touchmove: function(e) {
      // console.log('touchmove',e.touches[0].clientY);
      console.log(Math.floor((this.y - e.touches[0].clientY) / 30));
      this.scorllY = Math.floor((this.y - e.touches[0].clientY) / 30);
    },
    touchend: function() {
      this.touching = false;
      console.log(this.lyric[this.currentRow].time, "-----" + this.currentTime);
      if((this.currentRow + this.scorllY)>=0&&(this.currentRow + this.scorllY)<=this.lyric.length-1){
           this.$emit(
        "update:currentTime",
        this.lyric[this.currentRow + this.scorllY].time+0.5
      );
      }
     
    }
  }

  // 接口地址 : /lyric
};
</script>

<style lang="less" >
.show-lyric {
  position: absolute;
  z-index: 14;
  width: 100%;
  height: 70vh;
  margin-top: 30px;
  overflow: scroll;
}
.lyricMoves {
  // position: absolute;

  color: rgb(182, 156, 156);
  text-align: center;
  line-height: 30px;
  margin-top: 200px;
}
</style>>
