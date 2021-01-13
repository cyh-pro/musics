<template>
  <div>
    <BorderedTitle><slot></slot></BorderedTitle>
    <ul>
      <SongItem
        v-for="(song,index) in newSongs"
        :key="song.id"
        :item="song"
        :index='index'
        @update:music="$emit('update:music', $event)"
        @update:playlist="$emit('update:playlist', newSongs)"
        :currentMusic="$attrs.currentMusic"
        :paused="$attrs.paused"
      >
      </SongItem>
    </ul>
  </div>
</template>

<script>
import BorderedTitle from "@/components/BorderedTitle.vue";
import SongItem from "@/components/SongItem.vue";

export default {
  props: {
    newSongs: {
      type: Array
    }
  },
  components: {
    BorderedTitle,
    SongItem
  },
};
</script>

<style>
.index{
  line-height: 45px;
  text-align: center;
  font-size: 18px;
  padding: 5px;
}
</style>