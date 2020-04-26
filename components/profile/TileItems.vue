<template>
  <div class="mb-4" id="tiles">
    <TileItem v-for="tile in tiles" :key="tile.uuid" :tile="tile" @context-menu-event="closeAllContextMenus" />
    <div v-if="no_content && !tiles.length" class="profile-empty" onclick="$('#uploadModal').modal('show')">
      <template v-if="$route.path === '/profile/likes'">No likes yet :(</template>
      <template v-else><font-awesome-icon :icon="['fas', 'plus']" /> Upload your first meme!</template>
    </div>
  </div>
</template>

<script>
import TileItem from './TileItem'
import infiniteScrollMixin from '~/mixins/infiniteScrollMixin'

export default {
  name: 'TileItems',
  components: {
    TileItem
  },
  mixins: [infiniteScrollMixin],
  async mounted() {
    await this.loadMore()
    if (!this.tiles.length) this.no_content = true
  },
  data() {
    return {
      tiles: [],
      next: this.$route.path === "/profile" ? "/api/profile/memes/" : this.$route.path === "/profile/likes" ? "/api/profile/likes/" : `/api/user_page/memes/?u=${this.$route.params.username}`,
      no_content: false
    }
  },
  methods: {
    loadMore() {
      if (this.next) {
        this.$axios.get(this.next, {progress: false})
          .then(res => {
            if (res.data.results.length) {
              this.tiles.push(...res.data.results)
              this.next = res.data.next
            } else if (!this.tiles.length) {
              this.no_content = true
            }
          })
          .catch(console.log)
      }
    },
    closeAllContextMenus() {
      this.$children.forEach(c => {
        c.$refs.menu.close()
      })
    }
  }
}
</script>

<style scoped>
#tiles {
  display: flex;
  flex-wrap: wrap;
  /* justify-content: center; */
}
@media (max-width: 575.98px) {
  #tiles {
    margin-left: 5px;
  }
}
.profile-empty {
  text-align: center;
  padding: 100px;
  background-color: #090909;
  border-radius: 10px;
  margin-bottom: 10px;
  cursor: pointer;
  width: 100%;
}
</style>
