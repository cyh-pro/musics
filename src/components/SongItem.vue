<template>
  <li
    class="songitem"
    @click="
      $emit('update:music', { item, index, });
      $emit('update:playlist');

    "
  ><slot></slot>
    <div class="info">
      <h5>{{ item.name }}</h5>
      <div class="Pname">
        <span class="hot gss"></span>
        <span>{{singers}}</span>
        <!-- <span v-for="(artist, index) in item.song.artists" :key="index">
          <template v-if="index"  :names='artist.name' > / </template>{{ artist.name }}
        </span> -->
      </div>
    </div>
    <div class="icon">
      <span
        class="playing"
        :class="{ paused: paused }"
        v-if="currentMusic && currentMusic.id === item.id"
      >
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </span>
      <span v-else class="playT">
        <img src="../assets/playicon.svg" alt="" />
      </span>
    </div>
  </li>
</template>

<script>
export default {
  props: ["item", "index", "currentMusic", "paused"],
  computed:{
     singers(){
        let singarr=[];
        if(this.item.song){
          this.item.song.artists.forEach(element => {
            singarr.push(element.name)
          });
        }else{
          this.item.ar.forEach(element=>{
            singarr.push(element.name)
          })
        }
        return singarr.join("/")
      },
  
  }
};
</script>

<style lang="less">
li.songitem {
  height: 55px;
  display: flex;
  .info {
    h5 {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    flex: 1;
    padding: 6px 0;
    width: 0;
    font-size: 17px;
    .Pname {
      font-size: 12px;
      color: #888;
      .hot {
        display: inline-block;
        width: 12px;
        height: 8px;
        margin-right: 4px;
      }
      .gss {
        background: url("../assets/hot.png") no-repeat;
        background-size: 166px 97px;
      }
    }
  }

  .icon {
    margin: 10px;
    width: 25px;
    height: 25px;
    .playing {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      i {
        width: 3px;
        height: 25px;
        background: red;
        transform-origin: center bottom;
        animation: playing 0.6s linear -0.2s infinite alternate-reverse;

        &:first-of-type {
          animation-delay: 0s;
        }
         &:nth-of-type(3) {
          animation-delay: -0.3s;
        }
        &:last-of-type {
          animation-delay: -0.5s;
        }
      }
      &.paused {
        i {
          animation-play-state: paused;
        }
      }
    }
  }
}
@keyframes playing {
  from {
    // height: 50px;
    transform: scaleY(1);
  }
  to {
    // height: 10px;
    transform: scaleY(0.2);
  }
}
</style>