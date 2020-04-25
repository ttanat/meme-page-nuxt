<template>
  <li class="media mt-1 mb-4">
    <nuxt-link class="mr-3" :to="getURL">
      <img v-if="result.dp_url" class="media-img rounded-circle" :src="result.dp_url" height="45" width="45">
      <font-awesome-icon v-else :icon="['fas', searchUser ? 'user' : 'user-friends']" class="media-img" />
    </nuxt-link>
    <div class="media-body">
      <h6 class="mt-0 mb-1">
        <nuxt-link :to="getURL">
          {{ searchUser ? result.username : result.display_name || result.name }}
        </nuxt-link>
      </h6>
      <div v-if="getDescription" class="bio"><span>{{ getDescription }}</span></div>
      <small class="text-muted">{{ getBottomText }}</small>
    </div>
  </li>
</template>

<script>
export default {
  name: 'ListItem',
  props: {
    result: {
      type: Object,
      required: true
    },
    searchUser: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    getURL() {
      return this.searchUser ? `/user/${this.result.username}` : `/page/${this.result.name}`
    },
    getDescription() {
      // return this.description.replace(/\r\n/g, "  ")
      return this.searchUser ? this.result.bio : this.result.description
    },
    getBottomText() {
      return this.searchUser ? `${this.result.meme_count} meme${this.result.meme_count === 1 ? "" : "s"}` : `${this.result.num_subscribers} subscriber${this.result.num_subscribers === 1 ? "" : "s"}`
    }
  }
}
</script>

<style scoped>
.media-img {
  cursor: pointer;
  margin-bottom: 10px;
  margin-top: 3px;
}
svg.media-img {
  font-size: 35px;
  color: lightgrey;
}
h6 {
  font-size: 1.1rem;
}
.media-body a {
  color: darkgrey;
}
.bio {
  white-space: pre-wrap;
  font-size: 14px;
}
</style>
