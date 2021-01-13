<template>
  <div>
    <SongItemF
      v-for="(song, index) in newhot"
      :key="song.id"
      :item="song"
      :index="index"
     
    >
    <div class='index'>{{index+1| hotnum}}</div>
    </SongItemF>
  </div>
</template>

<script>
import SongItemF from "@/components/SongItemF.vue";

export default {
  props: ["newhot"],
  components: {
    SongItemF
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