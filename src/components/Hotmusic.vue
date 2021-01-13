<template>
  <div>
    <SongItem
      v-for="(song, index) in newhot"
      :key="song.id"
      :item="song"
      :index="index"
        @update:music="$emit('update:music', $event)"
        @update:playlist="$emit('update:playlist', newhot)"
        :currentMusic="$attrs.currentMusic"
      :paused="$attrs.paused"
    >
    <div class='index'>{{index+1| hotnum}}</div>
    </SongItem>
  </div>
</template>

<script>
import SongItem from "@/components/SongItem.vue";

export default {
  props: ["newhot"],
  components: {
    SongItem
  },
filters:{
			hotnum:function(value){
				if(value<10){
					return "0"+value;
				}
				return value;
			}
		},

 
};
</script>

<style scoped lang='less'>
.index{
   line-height: 45px;
  text-align: center;
  font-size: 18px;
  padding: 5px;
}
</style>