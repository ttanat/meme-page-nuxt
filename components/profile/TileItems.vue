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
      v-if="noContent && !tiles.length"
      class="profile-empty"
      :class="{pointer: $route.path === '/profile'}"
      :onclick="$route.path === '/profile' ? `$('#uploadModal').modal('show')` : ''"
    >
      <template v-if="$route.path === '/profile/likes'">No likes yet :(</template>
      <template v-else-if="$route.path === '/profile'"><font-awesome-icon :icon="['fas', 'plus']" /> Upload your first meme!</template>
      <template v-else-if="$route.path === '/profile/private'">No memes here :(</template>
      <template v-else>{{ banned ? "User is banned" : deleted ? "User deleted" : "No memes yet :(" }}</template>
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
  props: {
    banned: {
      type: Boolean,
      required: false,
      default: false
    },
    deleted: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  mixins: [infiniteScrollMixin, paginationOffsetMixin],
  created() {
    if (this.$store.state.justRegistered || this.banned || this.deleted) {
      this.noContent = true
      this.next = null
    } else {
      this.loadMore()
    }
    this.$root.$on("newMemeUploaded", this.showNewTile)
  },
  data() {
    return {
      tiles: [],
      next: this.$route.path === "/profile" ? "/api/profile/memes/"
                              : this.$route.path === "/profile/likes" ? "/api/profile/likes/"
                              : this.$route.path === "/profile/private" ? "/api/profile/private/"
                              : `/api/user_page/memes/?u=${this.$route.params.username}`,
      noContent: false,
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
      this.noContent = false
      this.increaseOffset(1)
    },
    loadMore() {
      if (this.next) {
        this.loading = true
        this.$axios.get(this.next)
          .then(({ data: { results, next } }) => {
            this.tiles.push(...results)
            this.next = next
            if (!results.length && !this.tiles.length) {
              this.noContent = true
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
      this.tiles = this.tiles.filter(tile => tile.uuid !== uuid)
      if (!this.tiles.length && this.next === null) this.noContent = true
      // Cannot decrease offset to negative value so next page will be missing some memes
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
