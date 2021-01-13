<template>
  <div>
    <section class="u-plhead ">
      <div
        class="plhead_bg"
        :style="{ 'background-image': 'url(' + coverImgUrl + ')' }"
      ></div>
      <div class="plhead_wrap">
        <div class="plhead_fl ">
          <!-- <img class="u-img"  :style='{"background-image":"url("+coverImgUrl+")"}' /> -->
          <img :src="coverImgUrl" class="u-img" />
          <span class="lsthd_icon">歌单</span>
          <span class="play-count">{{ playCount | formatPlayCount }}</span>
        </div>

        <div class="plhead_fr">
          <h2 class="lsthd_title">
            {{ coverName }}
          </h2>
          <div class='smallSinger'>  <img :src='avatarUrl'>
          <span>{{nickname}}</span>
          </div>
        </div>
      </div>
    </section>
    <Hotmusic
      :newhot="playlis"
      @update:music="$emit('update:music', $event)"
      @update:playlist="$emit('update:playlist', $event)"
      :currentMusic="$attrs.currentMusic"
      :paused="$attrs.paused"
    >
    </Hotmusic>
 <keep-alive>
    <Comments :hotComments="hotComments" @fnc='loadContent' v-if="playlis.length!=0"></Comments>
 </keep-alive>
  </div>
</template>

<script>
import Hotmusic from "@/components/Hotmusic.vue";
import Comments from "@/components/Comments.vue";

export default {
  components: {
    Hotmusic,
    Comments
  },
  data() {
    return {
      playlis: [],
      coverImgUrl: null,
      avatarUrl:null,
      nickname:"",
      coverName: "",
      playCount: null,
      hotComments: [],
      content: ""
    };
  },

  filters: {
    formatPlayCount(value) {
      return (value / 10000).toFixed(1) + "万";
    }
  },
 
  watch: {
    $route(to, from) {
      console.log("to", to);

      console.log("from", from);
      if (to.name === "Playlist") {
        this.getDa(to.query.id);
      } else {
        return false;
      }
    }
    //  '$route': 'getDa'
  },
  created() {
    this.getDa();
    this.loadContent();
  },
  methods: {
    loadContent() {
      var list = JSON.parse(localStorage.getItem("Comments") || "[]");
      this.hotComments = list;
    },
    postComment() {
      var comment = {
        id: Date.now(),
        user: {
          nickname: "辉",
          avatarUrl:
            "https://p3.music.126.net/cnjaUMH70z4v6Na8Fo83Ww==/109951164464664922.jpg"
        },
        content: this.content,
        likedCount: 0
      };
      var list = JSON.parse(localStorage.getItem("Comments") || "[]");
      list.unshift(comment);
      localStorage.setItem("Comments", JSON.stringify(list));
      this.content = "";
    },
    getDa() {
      this.$root.isShowLoading = true;
      this.axios
        .get("/playlist/detail?id=" + this.$route.query.id)
        .then(response => {
          console.log(response.data);
          this.coverImgUrl = response.data.playlist.coverImgUrl;
          this.playCount = response.data.playlist.playCount;
          this.coverName = response.data.playlist.name;
          this.avatarUrl = response.data.playlist.creator.avatarUrl;
          this.nickname = response.data.playlist.creator.nickname;
        })
        .finally(() => {
          this.$root.isShowLoading = false;
        });

      this.$root.isShowLoading = true;
      this.axios
        .get("/playlist/detail?id=" + this.$route.query.id)
        .then(response => {
          // this.hotId = response.data.playlist.trackIds
          //   .slice(0, 20)
          //   .map(e => e.id)
          //   .join();
          console.log(
            response.data.playlist.trackIds
              .slice(0, 20)
              .map(e => e.id)
              .join()
          );
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
              // console.log(response.data.songs);
              this.playlis = response.data.songs;
            })
            .finally(() => {
              this.$root.isShowLoading = false;
            });
        })
        .finally(() => {
          this.$root.isShowLoading = false;
        });
      this.$root.isShowLoading = true;
      this.axios
        .get("/comment/playlist?id=" + this.$route.query.id)
        .then(response => {
          console.log(response.data.hotComments);
          // this.hotComments = response.data.hotComments;
          localStorage.setItem(
            "Comments",
            JSON.stringify(response.data.hotComments)
            // this.hotComments =localStorage.getItem('Comments')
          );
          // this.loadContent()
          // var list = JSON.parse(localStorage.getItem("Comments") || "[]");
          // this.hotComments = list;
        })
        .finally(() => {
          this.$root.isShowLoading = false;
        });
    }
  
  }
};
</script>

<style scoped lang='less'>
.u-plhead {
  position: relative;
  padding: 30px 10px 30px 15px;
  overflow: hidden;
  .plhead_bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    filter: blur(10px) brightness(0.5);
  }

  .plhead_wrap {
    display: flex;
    position: relative;
    z-index: 2;
    .plhead_fl {
      position: relative;
      width: 114px;
      height: 114px;
      background-color: #e2e2e3;
      .lsthd_icon {
        position: absolute;
        z-index: 3;
        top: 15px;
        left: 0;
        padding: 0 8px;
        height: 17px;
        color: #fff;
        font-size: 9px;
        text-align: center;
        line-height: 17px;
        background-color: rgba(217, 48, 48, 0.8);
        border-top-right-radius: 17px;
        border-bottom-right-radius: 17px;
      }

      .play-count {
        top: 0;
        right: 0;
        text-shadow: 0 0 1px black;
        color: white;
        position: absolute;
        font-size: 9px;
        &::before {
          content: "";
          background-color: red;
          width: 0.9em;
          height: 0.9em;
          background: no-repeat
            url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMiAyMCI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBmaWxsPSIjMDQwMDAwIiBkPSJNMjIgMTYuNzc3YzAgMS4yMzMtMS4xMjEgMi4yMzMtMi41MDYgMi4yMzMtMS4zODQgMC0yLjUwNi0xLTIuNTA2LTIuMjMzdi0yLjU1M2MwLTEuMjM0IDEuMTIyLTIuMjMzIDIuNTA2LTIuMjMzLjE3NCAwIC4zNDMuMDE3LjUwNi4wNDZ2LTEuMzdoLS4wMzNjLjAxNy0uMjIuMDMzLS40NDEuMDMzLS42NjZhOCA4IDAgMCAwLTE2IDBjMCAuMjI1LjAxNi40NDYuMDM0LjY2Nkg0djEuMzdjLjE2My0uMDI5LjMzMy0uMDQ2LjUwNS0uMDQ2IDEuMzg0IDAgMi41MDYuOTk5IDIuNTA2IDIuMjMzdjIuNTUzYzAgMS4yMzMtMS4xMjIgMi4yMzMtMi41MDYgMi4yMzNTMiAxOC4wMTEgMiAxNi43Nzd2LTIuNTUzYzAtLjI1OC4wNTktLjUwMS4xNDgtLjczQS45ODIuOTgyIDAgMCAxIDIgMTMuMDAxdi0yLjY2N2MwLS4wMjMuMDEyLS4wNDMuMDEzLS4wNjctLjAwNC0uMDg4LS4wMTMtLjE3Ni0uMDEzLS4yNjYgMC01LjUyMyA0LjQ3Ny0xMCAxMC0xMHMxMCA0LjQ3NyAxMCAxMGMwIC4wOS0uMDA5LjE3OC0uMDE0LjI2Ni4wMDIuMDI0LjAxNC4wNDQuMDE0LjA2N3YyYS45ODguOTg4IDAgMCAxLS4zNi43NTNjLjIyNC4zMzQuMzYuNzIuMzYgMS4xMzh2Mi41NTIiIG9wYWNpdHk9Ii4xNSIvPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbD0iI2ZmZiIgZD0iTTIwIDE2Ljc3N2MwIDEuMjMzLTEuMTIxIDIuMjMzLTIuNTA2IDIuMjMzLTEuMzg0IDAtMi41MDYtMS0yLjUwNi0yLjIzM3YtMi41NTNjMC0xLjIzNCAxLjEyMi0yLjIzMyAyLjUwNi0yLjIzMy4xNzQgMCAuMzQzLjAxNy41MDYuMDQ2di0xLjM3aC0uMDMzYy4wMTctLjIyLjAzMy0uNDQxLjAzMy0uNjY2YTggOCAwIDAgMC0xNiAwYzAgLjIyNS4wMTYuNDQ2LjAzNC42NjZIMnYxLjM3Yy4xNjMtLjAyOS4zMzMtLjA0Ni41MDUtLjA0NiAxLjM4NCAwIDIuNTA2Ljk5OSAyLjUwNiAyLjIzM3YyLjU1M2MwIDEuMjMzLTEuMTIyIDIuMjMzLTIuNTA2IDIuMjMzUzAgMTguMDExIDAgMTYuNzc3di0yLjU1M2MwLS4yNTguMDU5LS41MDEuMTQ4LS43M0EuOTgyLjk4MiAwIDAgMSAwIDEzLjAwMXYtMi42NjdjMC0uMDIzLjAxMi0uMDQzLjAxMy0uMDY3LS4wMDQtLjA4OC0uMDEzLS4xNzYtLjAxMy0uMjY2IDAtNS41MjMgNC40NzctMTAgMTAtMTBzMTAgNC40NzcgMTAgMTBjMCAuMDktLjAwOS4xNzgtLjAxNC4yNjYuMDAyLjAyNC4wMTQuMDQ0LjAxNC4wNjd2MmEuOTg4Ljk4OCAwIDAgMS0uMzYuNzUzYy4yMjQuMzM0LjM2LjcyLjM2IDEuMTM4djIuNTUyIi8+PC9zdmc+");
          display: inline-block;
        }
      }
    }
    .plhead_fr {
      -webkit-box-flex: 1;
      -webkit-flex: 1 1 auto;
      -ms-flex: 1 1 auto;
      flex: 1 1 auto;
      width: 1%;
      margin-left: 16px;
      .lsthd_title {
        padding-top: 1px;
        font-size: 17px;
        line-height: 1.3;
        color: #fefefe;
        height: 44px;
        display: -webkit-box;
        -webkit-box-pack: center;
      }
      .smallSinger{
        color: white;
        margin-top: 19px;
         img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          vertical-align: middle;
          margin-right: 3px;
        }
        span{
         
          font-size: 12px;
        }
      }
    }
  }
}
.form-group {
  margin-top: 15px;
  margin-bottom: 15px;
  label {
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
    font-weight: 700;
  }
  .form-control {
    display: block;
    width: 100%;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
}
.form-group {
  margin-bottom: 15px;
}
</style>