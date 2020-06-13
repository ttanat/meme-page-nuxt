<template>
  <div class="mb-4" id="tiles">
    <TileItem
      v-for="tile in tiles"
      :key="tile.uuid"
      :tile="tile"
      @context-menu-event="closeAllContextMenus"
      @meme-deleted-event="removeTile"
    />
    <div v-show="loading" class="loading w-100"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
    <div
      v-if="no_content && !tiles.length"
      class="profile-empty"
      :class="{pointer: isProfilePage}"
      :onclick="isProfilePage ? `$('#uploadModal').modal('show')` : ''"
    >
      <template v-if="$route.path === '/profile/likes'">No likes yet :(</template>
      <template v-else-if="$route.path === '/profile'"><font-awesome-icon :icon="['fas', 'plus']" /> Upload your first meme!</template>
      <template v-else>No memes yet :(</template>
    </div>
  </div>
</template>

<script>
import TileItem from './TileItem'
import infiniteScrollMixin from '~/mixins/infiniteScrollMixin'
import paginationOffsetMixin from '~/mixins/paginationOffsetMixin'

export default {
  name: 'TileItems',
  components: {
    TileItem
  },
  mixins: [infiniteScrollMixin, paginationOffsetMixin],
  created() {
    this.loadMore()
    this.$root.$on("newMemeUploaded", this.showNewTile)
  },
  data() {
    return {
      tiles: [],
      next: this.$route.path === "/profile" ? "/api/profile/memes/" : this.$route.path === "/profile/likes" ? "/api/profile/likes/" : `/api/user_page/memes/?u=${this.$route.params.username}`,
      no_content: false,
      loading: false
    }
  },
  computed: {
    isProfilePage() {
      return this.$route.path.startsWith("/profile")
    }
  },
  methods: {
    showNewTile(tile) {
      this.tiles.unshift(tile)
      this.no_content = false
      this.increaseOffset(1)
    },
    loadMore() {
      if (this.next) {
        this.loading = true
        this.$axios.get(this.next)
          .then(({ data }) => {
            if (data.results.length) {
              this.tiles.push(...data.results)
              this.next = data.next
            } else if (!this.tiles.length) {
              this.no_content = true
              this.next = null
            }
          })
          .catch(console.log)
          .finally(() => this.loading = false)
      }
    },
    closeAllContextMenus() {
      this.$children.forEach(c => {
        c.$refs.menu.close()
      })
    },
    removeTile(uuid) {
      const i = this.tiles.findIndex(tile => tile.uuid === uuid)
      this.tiles.splice(i, 1)
      if (!this.tiles.length && this.next === null) this.no_content = true
    }
  },
  beforeDestroy() {
    this.$root.$off("newMemeUploaded", this.showNewTile)
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
  width: 100%;
}
</style>
