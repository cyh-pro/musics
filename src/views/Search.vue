<template>
  <div class="search">
    <div class="inputcover">
      <i class="svg-srch"></i>
      <input
        class="input"
        type="text"
        @input="condition = true"
        @keyup.enter="clickFn(something)"
        v-model.trim="something"
        placeholder="搜索歌曲、歌手、专辑"
        ref="input"
      />
      <i class="svg-right" @click="clearFn">x</i>
    </div>
    <!-- <div v-if="condition"> -->
    <div v-if="something" class="recom " v-show="condition">
      <h3 class="title">搜索" {{ something }} "</h3>
      <ul>
        <li
          v-for="(item, index) in currentS"
          :key="index"
          class="mlist"
          @click="(something = item.name), (condition = false)"
        >
          <i class=" u-svg-search"></i>
          <span> {{ item.name }}</span>
        </li>
      </ul>
    </div>

    <div v-if="!something" class="m-hotlist">
      <h5>热门搜索</h5>
      <ul class="list">
        <li
          v-for="(item, index) in searchDateS"
          :key="index"
          class="item"
          @click="(something = item.searchWord), (condition = false)"
        >
          {{ item.searchWord }}
        </li>
      </ul>
    </div>
    <!-- </div> -->

    <Hotmusic
      v-if="something"
      v-show="!condition"
      :newhot="HotPlaylist"
      @update:music="$emit('update:music', $event)"
      @update:playlist="$emit('update:playlist', $event)"
      :currentMusic="$attrs.currentMusic"
      :paused="$attrs.paused"
    >
    </Hotmusic>
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
      something: "",
      suggests: [],
      searchDate: [], //热搜关键词
      HotPlaylist: [],
      condition: true,
      text: ""
    };
  },
  watch: {
    something: function(n) {
      console.log(n, "something==");
      if (n) {
        if (this.condition) {
          console.log("getData 搜索了");
          // this.getData();
          this.adebounce(this.getData(), 1000);
        } else {
           (this.HotPlaylist = [])
          this.getDatas(n);
        }
      } else {
        console.log("watch  something");
        (this.HotPlaylist = []), (this.condition = true);
        console.log("something为空", this.condition);
      }
    }
  },

  computed: {
    currentS: function() {
      return this.suggests.slice(0, 6);
    },
    searchDateS: function() {
      return this.searchDate.slice(0, 10);
    }
  },
  methods: {
    adebounce(fn, wait) {
      var timer = null;
      return function() {
        if (timer !== null) {
          clearTimeout(timer);
        }
        timer = setTimeout(fn, wait);
      };
    },
    clickFn(n) {
      this.condition = false;
      this.HotPlaylist = [];
      this.getDatas(n);
    },
    clearFn() {
      console.log("点击了");
      (this.something = ""), (this.HotPlaylist = []);
    },
    getData: function() {
      this.$root.isShowLoading = true;
      let _this = this;
      if (this.something) {
        _this.axios
          .get("/search?keywords=" + this.something)
          .then(response => {
            // console.log(response.data.result);
            _this.suggests = response.data.result.songs;
          })
          .finally(() => {
            _this.$root.isShowLoading = false;
          });
      }
    },
    getDatas(name) {
      this.$root.isShowLoading = true;
      if (name) {
        this.axios
          .get("/search?keywords=" + name)
          .then(response => {
            console.log(response.data.result.songs);
            let searchList = response.data.result.songs;
            console.log(response.data.result.songs.id)

            for (var i in searchList) {
              let HotPlaylistobj = {};
              HotPlaylistobj.name = searchList[i].name; //歌名
              HotPlaylistobj.id = searchList[i].id;
              HotPlaylistobj.picUrl = searchList[i].artists[0].img1v1Url;
              HotPlaylistobj.song = {
                artists: [{ name: searchList[i].artists[0].name }]
              };
              // this.HotPlaylist.push(HotPlaylistobj);
              // this.HotPlaylist.push(HotPlaylistobj);
              this.HotPlaylist = [...this.HotPlaylist, HotPlaylistobj];
            }
            // console.log(this.HotPlaylist);
          })
          .finally(() => {
            // this.condition = !this.condition;
            console.log("成功了", this.condition);

            this.$root.isShowLoading = false;
          });
      }
    }
  },
  created() {
    // this.debouncedGetData =_.debounce(this.getData, 500);

    this.axios.get("/search/hot/detail").then(response => {
      this.searchDate = response.data.data;
    });
  }
};
</script>

<style scoped lang='less'>
.search {
  padding: 15px 10px;

  .inputcover {
    position: relative;
    width: 100%;
    height: 30px;
    padding: 0 30px;
    box-sizing: border-box;
    background: #ebecec;
    border-radius: 30px;
    .svg-srch {
      position: absolute;
      left: 0;
      top: 9px;
      margin: 0 8px;
      vertical-align: middle;
      width: 13px;
      height: 13px;
      background: url("../assets/search.svg");
    }
    .svg-right {
      position: absolute;
      right: 0;
      top: 7px;
      margin: 0 8px;
      vertical-align: middle;
      width: 13px;
      height: 13px;
    }
    .input {
      width: 100%;
      height: 30px;
      line-height: 18px;
      background: rgba(0, 0, 0, 0);
      font-size: 14px;
      color: #333;
      border-radius: 0;
      border: 0;
      outline: 0;
    }
  }
  .recom {
    .title {
      height: 50px;
      margin-left: 10px;
      padding-right: 10px;
      font-size: 15px;
      line-height: 50px;
      color: #507daf;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: normal;
    }
    li.mlist {
      display: flex;
      align-items: center;
      height: 45px;
      padding-left: 10px;
      .u-svg-search {
        width: 15px;
        height: 15px;
        background: url("../assets/search.svg");
        &:hover {
          transform: scale(1.2);
        }
      }
      i {
        flex: 0 0 auto;
        margin-right: 7px;
        display: inline-block;
        vertical-align: middle;
        background-position: 0 0;
        background-size: contain;
        background-repeat: no-repeat;
      }
      span {
        display: inline-block;
        padding-right: 10px;
        width: 1%;
        flex: 1;
        font-size: 15px;
        line-height: 45px;
        color: #333;
      }
    }
  }
  .m-hotlist {
    padding: 15px 10px 0;
    .list {
      margin: 10px 0 7px;
      .item {
        display: inline-block;
        height: 32px;
        margin-right: 8px;
        padding: 0 14px;
        font-size: 14px;
        text-align: center;
        line-height: 30px;
        color: #333;
        border-radius: 10px;
        border: 1px solid rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>