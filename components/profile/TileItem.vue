<template>
  <div class="tile" @contextmenu.prevent>
    <a :href="'/m/'+tile.uuid" target="_blank" draggable="false">
      <font-awesome-icon v-if="!isImg && !isGif" :icon="['fas', 'play']" class="play-icon" />
      <h5 v-else-if="isGif" class="play-icon">GIF</h5>
      <video v-if="!isImg" ref="vid" :src="tile.url" preload="metadata" loop class="content" draggable="false"></video>
      <img v-else :src="tile.url" class="content" draggable="false">
    </a>
  </div>
</template>

<script>
export default {
  name: 'TileItem',
  props: {
    tile: {
      type: Object,
      required: true
    }
  },
  computed: {
    isImg() {
      return ["image/jpeg", "image/png"].includes(this.tile.content_type)
    },
    isGif() {
      return this.tile.content_type === "image/gif"
    }
  }
}
</script>

<style scoped>
.tile {
  /* margin: 1%; */
  height: 0;
  position: relative;
  width: 30%;
  padding-bottom: 30%;
}
.play-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  font-size: 1.62rem;
  color: whitesmoke;
}
.content {
  object-fit: cover;
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>