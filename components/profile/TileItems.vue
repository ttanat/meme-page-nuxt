<template>
  <div class="w-100">
    <TileItem v-for="tile in tiles" :key="tile.uuid" :tile="tile" />
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
      next: this.$route.path === "/profile" ? "/api/profile/memes" : this.$route.path === "/profile/likes" ? "/api/profile/likes" : `/api/user_page/memes/?u=${this.$route.params.username}`,
      no_content: false
    }
  },
  methods: {
    loadMore() {
      if (this.next) {
        this.$axios.get(this.next)
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
    }
  }
}
</script>

<style>

</style>