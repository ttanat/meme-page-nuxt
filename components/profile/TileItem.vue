<template>
  <div class="tile" @contextmenu.prevent="openContextMenu">
    <nuxt-link :to="'/m/'+tile.uuid" target="_blank" draggable="false">
      <span v-if="!isImg && !isGif" class="play-icon"><font-awesome-icon :icon="['fas', 'play']" /></span>
      <h5 v-else-if="isGif" class="play-icon">GIF</h5>
      <video v-if="!isImg" ref="vid" :src="tile.url" preload="metadata" loop class="content" draggable="false"></video>
      <img v-else :src="tile.url" class="content" draggable="false">
    </nuxt-link>
    <!-- Context menu is here because it doesn't work on TileItem component in ./TileItems.vue -->
    <vue-context v-if="isProfilePage" ref="menu">
      <li>
        <a :href="'/m/'+tile.uuid" target="_blank">
          <font-awesome-icon :icon="['fas', 'external-link-alt']" />&ensp;Open in new tab
        </a>
      </li>
      <li>
        <a :href="tile.url" target="_blank">
          <font-awesome-icon :icon="['fas', 'download']" />&ensp;Download
        </a>
      </li>
      <li>
        <a href="javascript:void(0);" @click="deleteMeme">
          <font-awesome-icon :icon="['fas', 'trash-alt']" />&ensp;Delete
        </a>
      </li>
    </vue-context>
  </div>
</template>

<script>
import VueContext from 'vue-context'

export default {
  name: 'TileItem',
  components: {
    VueContext
  },
  props: {
    tile: {
      type: Object,
      required: true
    }
  },
  computed: {
    isProfilePage() {
      return this.$route.path.startsWith("/profile")
    },
    isImg() {
      return ["image/jpeg", "image/png"].includes(this.tile.content_type)
    },
    isGif() {
      return this.tile.content_type === "image/gif"
    }
  },
  methods: {
    async openContextMenu(e) {
      if (this.isProfilePage) {
        // Close all other context menus first
        await this.$emit("context-menu-event")
        this.$refs.menu.open(e)
      }
    },
    deleteMeme() {
      if (confirm("Are you sure you want to delete this?")) {
        this.$toasted.show("psych", {duration: 5000})
      }
    }
  }
}
</script>

<style scoped>
@import  'vue-context/dist/css/vue-context.css';
.tile {
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
@media (max-width: 575.98px) {
  .tile {
    margin: 2px;
  }
}
@media (min-width: 575.98px) {
  .tile {
    margin: 1%;
  }
}
.v-context {
  font-size: 15px;
}
</style>