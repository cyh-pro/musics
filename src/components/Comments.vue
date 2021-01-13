<template>
  <div class="comment-list">
    <h5 class="comments_title">精彩评论</h5>
    <ul>
      <Commentlist
        v-for="(item, index) in hotComments"
        :key="index"
        :item="item"
      >
      </Commentlist>
    </ul>
    <div class="form-group">
      <label>发表评论：</label>
      <textarea class="form-control" v-model.trim="content"  ></textarea>
    </div>

    <div class="form-group1">
      <input
        type="button"
        value="发表评论"
        class="btn btn-primary"
        @click="postComment"
      />
    </div>
  </div>
</template>

<script>
import Commentlist from "@/components/Commentlist.vue";

export default {
  props: ["hotComments"],
  components: {
    Commentlist
  },
  data() {
    return {
      content: ""
    };
  },
 
  methods: {
    postComment() {
      var comment = {
        id: Date.now(),
        user: {
          nickname: "辉",
          avatarUrl:
            "https://p3.music.126.net/kgoxo3_kbFGYGrnVccu5MA==/109951163575640220.jpg"
        },
        content: this.content,
        likedCount: 0
      };
      var list = JSON.parse(localStorage.getItem("Comments") || "[]");
      list.push(comment);
      localStorage.setItem("Comments", JSON.stringify(list));
      this.content = "";
       this.$emit('fnc')
    }
  }
};
</script>

<style lang='less'>
.comment-list {
  margin: 15px auto;
  .comments_title {
    padding: 0 10px;
    height: 23px;
    line-height: 23px;
  }
  .form-group {
    margin-top: 15px;
    margin-bottom: 5px;
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
  .form-group1 {
    margin-bottom: 60px;
  }
}
</style>