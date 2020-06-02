<template>
  <div>
    <h6>Main</h6>
    <nuxt-link to="/" :class="{'sl-active': getActiveLink('/')}" no-prefetch><font-awesome-icon :icon="['fas', 'fire']" fixed-width />&ensp;Dank Memes</nuxt-link>
    <nuxt-link v-if="$auth.loggedIn" to="/feed" :class="{'sl-active': getActiveLink('/feed')}" no-prefetch><font-awesome-icon :icon="['fas', 'carrot']" fixed-width />&ensp;Feed</nuxt-link>
    <a v-else href="javascript:void(0)" onclick="$('#loginModal').modal('show')" :class="{'sl-active': getActiveLink('/feed')}"><font-awesome-icon :icon="['fas', 'carrot']" fixed-width />&ensp;Feed</a>
    <nuxt-link to="/all" :class="{'sl-active': getActiveLink('/all')}" no-prefetch><font-awesome-icon :icon="['fas', 'bars']" fixed-width />&ensp;Browse all</nuxt-link>
    <template v-if="getModerating.length">
      <hr>
      <h6>Pages</h6>
      <nuxt-link v-for="m in getModerating" :key="m.name" :to="'/page/'+m.name" no-prefetch>
        <font-awesome-icon :icon="['fas', m.private ? 'lock' : 'star']" fixed-width />&ensp;{{ m.dname || m.name }}
      </nuxt-link>
    </template>
    <template v-if="getSubscriptions.length">
      <hr>
      <h6>Subscriptions</h6>
      <nuxt-link v-for="s in getSubscriptions" :key="s.name" :to="'/page/'+s.name" no-prefetch>
        <font-awesome-icon :icon="['fas', s.private ? 'lock' : 'star']" fixed-width />&ensp;{{ s.dname || s.name }}
      </nuxt-link>
    </template>
    <hr>
    <h6>Categories</h6>
    <nuxt-link
      v-for="c in categories"
      :key="c[2]"
      :to="`/browse/${getSlug(c[2])}`"
      :class="{'sl-active': getActiveLink(`/browse/${getSlug(c[2])}`)}"
      no-prefetch
    >
      <font-awesome-icon :icon="[`fa${c[0]}`, c[1]]" fixed-width />&ensp;{{ c[2] }}
    </nuxt-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        // [prefix, iconName, displayName],
        ['s', 'film', 'Movies'],
        ['s', 'tv', 'TV Shows'],
        ['s', 'gamepad', 'Gaming'],
        ['s', 'paw', 'Animals'],
        ['s', 'globe-americas', 'Internet'],
        ['s', 'school', 'School'],
        ['r', 'grin-beam', 'Anime'],
        ['r', 'grin-alt', 'People'],
        ['s', 'running', 'Sports'],
        ['s', 'futbol', 'Football'],
        ['s', 'basketball-ball', 'NBA'],
        ['s', 'football-ball', 'NFL'],
        ['r', 'newspaper', 'News'],
        ['s', 'graduation-cap', 'University']
      ]
    }
  },
  computed: {
    getModerating() {
      return this.$auth.loggedIn ? this.$auth.user.moderating : []
    },
    getSubscriptions() {
      return this.$auth.loggedIn ? this.$auth.user.subscriptions : []
    }
  },
  methods: {
    getSlug(s) {
      return s.toLowerCase().replace(/ /g, '-')
    },
    getActiveLink(link) {
      return link === this.$route.path
    }
  }
}
</script>

<style scoped>
@import '~/assets/sidebar.css';
h6 {
  color: grey;
  font-size: 1.05rem;
}
hr {
  background-color: #505050;
}
</style>