<template>
  <div class="col-md-2 mt-1 mb-5">
    <nuxt-link
      :to="'/p/'+$route.params.name"
      class="btn btn-sm btn-secondary mb-3 p-0"
      id="back-btn"
      no-prefetch
    >
      Back
    </nuxt-link>
    <nuxt-link
      v-if="adminView"
      :to="'/p/'+$route.params.name+'/settings'"
      :class="{'sl-active': $route.path.endsWith('/settings')}"
      class="sidebar"
      no-prefetch
    >
      Settings
    </nuxt-link>
    <nuxt-link
      :to="'/p/'+$route.params.name+'/moderators'"
      :class="{'sl-active': $route.path.endsWith('/moderators')}"
      class="sidebar"
      no-prefetch
    >
      Moderators
    </nuxt-link>
    <nuxt-link
      v-if="pagePrivate"
      :to="'/p/'+$route.params.name+'/requests'"
      :class="{'sl-active': $route.path.endsWith('/requests')}"
      class="sidebar"
      no-prefetch
    >
      Requests
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'SettingsSidebar',
  props: {
    adminView: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    pagePrivate() {
      return this.$auth.loggedIn && !!this.$auth.user.moderating.find(p => p.name === this.$route.params.name && p.private)
    }
  }
}
</script>

<style src="~/assets/sidebar.css" scoped></style>
<style scoped>
#back-btn {
  width: 55px;
  border-radius: 4px;
  color: gainsboro;
}
</style>
