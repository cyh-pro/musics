<template>
  <div>
    <BorderedTitle><slot></slot></BorderedTitle>
    <ul class="playlist">
      <PlayListItem
        v-for="plays in currentRecommends"
        :key="plays.id"
        :plays="plays"
      />
    </ul>
  </div>
</template>

<script>
import BorderedTitle from "@/components/BorderedTitle.vue";
import PlayListItem from "@/components/PlayListItem.vue";
export default {
 props: {
    currentRecommends: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  components: {
    BorderedTitle,
    PlayListItem
  }
};
</script>

<style>
.playlist {
    display: flex;
    flex-wrap: wrap;
}
</style>