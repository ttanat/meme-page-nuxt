<template>
  <div class="tile" @contextmenu.prevent="openContextMenu" :style="{opacity: deleting ? '.5' : ''}">
    <nuxt-link :to="'/m/'+tile.uuid" target="_blank" draggable="false">
      <div v-if="$route.path === '/profile'" class="points" :class="[tile.points > 0 ? 'green' : tile.points < 0 ? 'red' : '']">{{ formatNumber(tile.points) }}</div>
      <span v-if="isVid" class="play-icon"><font-awesome-icon :icon="['fas', 'play']" /></span>
      <h5 v-else-if="isGif" class="play-icon">GIF</h5>
      <img :src="tile.url" class="content" draggable="false">
    </nuxt-link>
    <!-- Context menu is here because it doesn't work on TileItem component in ./TileItems.vue -->
    <vue-context ref="menu">
      <li>
        <a :href="'/m/'+tile.uuid" target="_blank">
          <font-awesome-icon :icon="['fas', 'external-link-alt']" />&ensp;Open in new tab
        </a>
      </li>
      <li>
        <a href="javascript:void(0);" @click="copyLink">
          <font-awesome-icon :icon="['fas', 'link']" />&ensp;Copy link
        </a>
      </li>
      <li>
        <a :href="'/img?m='+tile.uuid" target="_blank">
          <font-awesome-icon :icon="['fas', 'download']" />&ensp;Download
        </a>
      </li>
      <li v-if="isProfilePage">
        <a href="javascript:void(0);" @click="deleteMeme">
          <font-awesome-icon :icon="['fas', 'trash-alt']" />&ensp;Delete
        </a>
      </li>
    </vue-context>
  </div>
</template>

<script>
import VueContext from 'vue-context'
import formatNumberMixin from '~/mixins/formatNumberMixin'
import copy from 'copy-to-clipboard'

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
  mixins: [formatNumberMixin],
  data() {
    return {
      deleting: false
    }
  },
  computed: {
    isProfilePage() {
      return this.$route.path.startsWith("/profile")
    },
    isVid() {
      return [".mp4", ".mov"].includes(this.tile.file_ext.toLowerCase())
    },
    isGif() {
      return this.tile.file_ext.toLowerCase() === ".gif"
    }
  },
  methods: {
    async openContextMenu(e) {
      // Close all other context menus first
      await this.$emit("context-menu-event")
      // Don't open context menu if deleting (deleting takes a few seconds and user can still do stuffs with tile)
      this.deleting ? this.showDeletingMemeToast() : this.$refs.menu.open(e)
    },
    showDeletingMemeToast() {
      this.$toast.info("Deleting meme...", {
        position: 'bottom-center',
        duration: 1500
      })
    },
    copyLink() {
      copy(`${window.location.origin}/m/${this.tile.uuid}`)
      this.$toast.success("Copied", {
        position: 'bottom-center',
        duration: 1000
      })
    },
    async deleteMeme() {
      if (confirm("Are you sure you want to delete this?")) {
        this.deleting = true
        this.showDeletingMemeToast()
        try {
          const { status } = await this.$axios.delete(`/api/delete/meme/${this.tile.uuid}`)
          if (status !== 204) throw "Unexpected error occurred"
          this.$emit("meme-deleted-event", this.tile.uuid)
          // Not actually an error, but using toast for errors
          this.displayError("Meme has been deleted :(")
        } catch (err) {
          this.displayError(err)
          this.deleting = false
        }
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
.points {
  display: flex;
  position: absolute;
  z-index: 2;
  right: 0;
  font-size: 12px;
  background: #333;
  padding: 0 3px 1px 4px;
  border-bottom-left-radius: 5px;
  text-decoration: none;
  color: lightgrey;
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