<template>
  <div class="dropdown">
    <a type="button" class="nav-item nav-link text-light mr-2" data-toggle="dropdown">
      <img v-if="$auth.user.image" class="rounded-circle" :src="$auth.user.image" height="21" width="21">
      <font-awesome-icon v-else :icon="['fas', 'user-circle']" class="ml-1" />&ensp;<font-awesome-icon :icon="['fas', 'caret-down']" />
    </a>
    <div class="dropdown-menu dropdown-menu-right dropdown-dark">
      <h5 class="dropdown-header m-0">
        {{ $auth.user.username }}
      </h5>
      <nuxt-link class="dropdown-item" to="/profile" no-prefetch>
        <font-awesome-icon :icon="['fas', 'user']" /> Profile
      </nuxt-link>
      <div @click="toggleNightMode" class="dropdown-item pointer">
        <font-awesome-icon :icon="[$store.state.nightMode ? 'fas' : 'far', 'moon']" /> Night
      </div>
      <nuxt-link class="dropdown-item" to="/settings" no-prefetch>
        <font-awesome-icon :icon="['fas', 'cog']" /> Settings
      </nuxt-link>
      <div class="dropdown-divider"></div>
      <div class="dropdown-item pointer" @click="$auth.logout()">
        <font-awesome-icon :icon="['fas', 'sign-out-alt']" /> Logout
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserDropdown',
  methods: {
    toggleNightMode() {
      this.$store.commit("toggleNightMode")
    }
  }
}
</script>

<style scoped>
.dropdown-menu-right {
  width: 190px;
  background: #252525;
}
.dropdown-menu-right > .dropdown-header {
  overflow-x: hidden;
  text-overflow: ellipsis;
}
</style>
