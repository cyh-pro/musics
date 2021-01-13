<template>
  <div class="recommend">
    <RecommendVi :currentRecommends="currentRecommends">推荐歌单</RecommendVi>
    <RecommendNew
      :newSongs="newSongs"
      @update:music="$emit('update:music', $event)"
      @update:playlist="$emit('update:playlist', $event)"

      :currentMusic="$attrs.currentMusic"
      :paused="$attrs.paused"
      >最新音乐</RecommendNew
    >
  </div>
</template>

<script>
import RecommendVi from "@/components/RecommendVi.vue";
import RecommendNew from "@/components/RecommendNew.vue";

export default {
  name: "recommend",
  components: {
    RecommendVi,
    RecommendNew
  },
  data() {
    return {
      recommends: [],
      newSongs: [],
      recommendsIndex: 0,
      count: 0
    };
  },
  computed: {
    currentRecommends: function() {
      return this.recommends.slice(
        this.recommendsIndex * 6,
        (this.recommendsIndex + 1) * 6
      );
    }
  },
  created() {
    this.$root.isShowLoading = true;
    this.axios
      .get("/personalized")
      .then(response => {
        // console.log(response);
        this.recommends = response.data.result;
      })
      .finally(() => {
        this.count = this.count + 1;
      });
    this.axios
      .get("/personalized/newsong")
      .then(response => {
        // console.log(response.data.result);
        this.newSongs = response.data.result;
      })
      .finally(() => {
        this.count = this.count + 1;
      });
  },
  watch: {
    count(n) {
      if (n >= 2) {
        this.$root.isShowLoading = false;
      }
    }
  },
  activated() {
    console.log("切换到推荐");
    this.recommendsIndex =
        this.recommendsIndex >= 4 ? 0 : this.recommendsIndex + 1;
  }
};
</script>

<style>
</style>