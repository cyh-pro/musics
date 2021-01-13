<template>
  <div @click="$emit('show-play-bar')" class="Play-header">
    <div class="icon"><span></span></div>
    <div class="text">
      <h5>{{ currentMusic.name }}</h5>
      <h6>{{ singers }}</h6>
    </div>
  </div>
</template>

<script>
export default {
  props: ["currentMusic", "singers"]
};
</script>

<style scoped lang='less' >
.Play-header {
  height: 50px;
  color: white;
  background: linear-gradient(
    to right,
    rgb(46, 19, 19),
    rgb(56, 56, 56),
    rgb(56, 56, 56)
  );
  display: flex;
  .icon {
    padding: 12px 5px 12px 10px;
    span {
      display: block;
      width: 25px;
      height: 25px;
      background: url("../assets/back.svg");
      background-size: 100%;
    }
  }
  .text {
    padding: 8px;
    h5 {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    h6 {
      font-size: 14px;
    }
  }
}
</style>