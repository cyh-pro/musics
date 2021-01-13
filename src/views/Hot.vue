<template>
  <div class="hot">
    <div class="hottop">
      <div class="hotopct">
        <div class="hoticon"></div>
        <div class="hottime">更新日期：{{this.value}}</div>
      </div>
    </div>
    <Hotmusic
      :newhot="hotM"
      @update:music="$emit('update:music', $event)"
      @update:playlist="$emit('update:playlist', $event)"
      :currentMusic="$attrs.currentMusic"
      :paused="$attrs.paused"
    >
    </Hotmusic>
    <div class="hotdn" v-show="hotM.length!='' ">
      <span class="hotview">查看完整榜单</span>
    </div>
  </div>
</template>

<script>
import Hotmusic from "@/components/Hotmusic.vue";

export default {
  components: {
    Hotmusic
  },
  data() {
    return {
      hotM: [],
      hotId: [],
      value: null
    };
  },
  // <h5>{{ currentMusic.name }}</h5>
  //  <h5>{{ currentMusic.song.artists[0].name }}</h5>

  // <h5>{{ currentMusic.al.name }}</h5>
  //  <h5>{{ currentMusic.ar[0].name }}</h5>
  created() {
    console.log("Hot created");
    this.$root.isShowLoading = true;
    this.axios
      .get("/top/list?idx=1")
      .then(response => {
        this.hotId = response.data.playlist.trackIds
          .slice(0, 20)
          .map(e => e.id)
          .join();
        // console.log(
        //   response.data.playlist.trackIds
        //     .slice(0, 20)
        //     .map(e => e.id)
        //     .join()
        // );
        this.$root.isShowLoading = true;
        this.axios
          .get(
            "/song/detail?ids=" +
              response.data.playlist.trackIds
                .slice(0, 20)
                .map(e => e.id)
                .join()
          )
          .then(response => {
            console.log(response.data.songs);
            this.hotM = response.data.songs;
          })
          .finally(() => {
            this.$root.isShowLoading = false;
          });
      })
      .finally(() => {
        this.$root.isShowLoading = false;
      });
    var aData = new Date();
    // console.log(aData); //Wed Aug 21 2019 10:00:58 GMT+0800 (中国标准时间)

    this.value = aData.getMonth() + 1 + "月" + aData.getDate()+'日';
    // console.log(this.value); //2019-8-20
  },
 
};
</script>

<style scoped lang='less'>
.hottop {
  background: url(//s3.music.126.net/mobile-new/img/hot_music_bg_2x.jpg?f01a252389c26bcf016816242eaa6aee=)
    no-repeat;
  position: relative;
  padding-top: 38.9%;
  overflow: hidden;
  background-size: contain;
  .hotopct {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2;
    padding-left: 20px;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: center;
    display: flex;
  }
  .hoticon {
    width: 146px;
    height: 70px;
    /* background-position: -24px -30px; */
    background: url(//s3.music.126.net/mobile-new/img/index_icon_2x.png?5207a28c3767992ca4bb6d4887c74880=)
      no-repeat -21px -28px;
    background-size: 166px 97px;
    
  }
  .hottime {
      margin-top: 10px;
      color: hsla(0, 0%, 100%, 0.8);
      font-size: 12px;
    }
}

.hotdn {
  height: 55px;
  line-height: 55px;
  text-align: center;
}
.hotview {
  display: inline-block;
  color: #999;
  padding-right: 14px;
  background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNCAyMiI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgZD0iTTEgMWwxMCAxMEwxIDIxIi8+PC9zdmc+)
    100% no-repeat;
  background-size: 7px 12px;
}
</style>