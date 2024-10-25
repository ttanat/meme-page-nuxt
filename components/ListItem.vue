<template>
  <li class="media mt-1 mb-4">
    <nuxt-link class="mr-3 media-img-link" :to="getURL" no-prefetch>
      <img v-if="result.image" class="media-img rounded-circle" :src="result.image" height="45" width="45">
      <font-awesome-icon v-else :icon="['fas', searchUser ? 'user' : 'user-friends']" class="media-img" />
    </nuxt-link>
    <div class="media-body">
      <h6 class="mt-0 mb-1">
        <nuxt-link :to="getURL" no-prefetch>
          {{ searchUser ? result.username : result.display_name || result.name }}
          <small v-if="!searchUser && result.display_name">&nbsp;({{ result.name }})</small>
        </nuxt-link>
      </h6>
      <div v-if="hasBio" class="bio" v-html="displayBio"></div>
      <small class="text-muted">{{ getBottomText }}</small>
    </div>
  </li>
</template>

<script>
import parseBioMixin from '~/mixins/parseBioMixin'

export default {
  name: 'ListItem',
  props: {
    result: {
      type: Object,
      required: true
    }
  },
  mixins: [parseBioMixin],
  computed: {
    searchUser() {
      return this.$route.query.q[0] === '@'
    },
    getURL() {
      return this.searchUser ? `/user/${this.result.username}` : `/p/${this.result.name}`
    },
    hasBio() {
      return !!(this.searchUser ? this.result.bio : this.result.description)
    },
    displayBio() {
      return this.parseBio(this.searchUser ? this.result.bio : this.result.description).replace(/\r\n/g, " ")
    },
    getBottomText() {
      const s = !this.searchUser && this.result.num_subscribers !== 1 ? "s" : ""
      return this.searchUser ? `${this.result.clout} clout` : `${this.result.num_subscribers} subscriber${s}`
    }
  }
}
</script>

<style scoped>
.media-img-link {
  width: 45px;
  text-align: center;
}
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
  color: #858585;
}
.bio {
  white-space: pre-wrap;
  font-size: 14px;
}
</style>
