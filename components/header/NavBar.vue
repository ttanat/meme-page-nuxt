<template>
  <nav class="navbar navbar-expand-lg navbar-dark justify-content-between" :class="{'sticky-top': !$store.state.showOverlay}">
    <nuxt-link class="navbar-brand ml-xl-4" to="/">Meme Page</nuxt-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">

      <div id="navbar-middle" class="navbar-nav collapse navbar-collapse justify-content-center">
        <a class="nav-item nav-link mr-3 pointer">{{ $store.state.currentPage }}</a>
        <SearchBar />
      </div>

      <div class="navbar-nav ml-auto mr-lg-0 mr-xl-3">
        <template v-if="$auth.loggedIn">
          <nuxt-link class="nav-item nav-link text-light mr-3" to="/" title="Home">
            <font-awesome-icon :icon="['fas', 'home']" fixed-width /><span class="d-lg-none"> Home</span>
          </nuxt-link>
          <a v-if="$route.path.startsWith('/profile')" type="button" class="nav-item nav-link text-light mr-3" data-toggle="modal" data-target="#newMemePage" title="New meme page">
            <font-awesome-icon :icon="['fas', 'plus']" fixed-width /><span class="d-lg-none"> New meme page</span>
          </a>
          <a type="button" class="nav-item nav-link text-light mr-3" data-toggle="modal" data-target="#uploadModal" title="Upload">
            <font-awesome-icon :icon="['fas', 'file-upload']" fixed-width /><span class="d-lg-none"> Upload</span>
          </a>
          <NotificationsDropdown />
          <div class="dropdown">
            <a type="button" class="nav-item nav-link text-light mr-2" data-toggle="dropdown">
              <img v-if="$auth.user.image" class="rounded-circle" :src="$auth.user.image" height="21" width="21">
              <font-awesome-icon v-else :icon="['fas', 'user-circle']" class="ml-1" />&ensp;<font-awesome-icon :icon="['fas', 'caret-down']" />
            </a>
            <div class="dropdown-menu dropdown-menu-right">
              <h5 class="dropdown-header m-0">
                {{ $auth.user.username }}
              </h5>
              <nuxt-link class="dropdown-item user-dropdown" to="/profile" no-prefetch>
                <font-awesome-icon :icon="['fas', 'user']" /> Profile
              </nuxt-link>
              <div @click="toggleNightMode" class="dropdown-item user-dropdown pointer">
                <font-awesome-icon :icon="[$store.state.nightMode ? 'fas' : 'far', 'moon']" /> Night
              </div>
              <nuxt-link class="dropdown-item user-dropdown" to="/settings" no-prefetch>
                <font-awesome-icon :icon="['fas', 'cog']" /> Settings
              </nuxt-link>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item user-dropdown pointer" @click="$auth.logout()">
                <font-awesome-icon :icon="['fas', 'sign-out-alt']" /> Logout
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <button class="btn btn-sm mr-3" style="width: 100px;visibility: hidden;"></button>
          <button type="button" class="btn btn-sm btn-outline-success mr-3 mb-2 mb-lg-0" data-toggle="modal" data-target="#loginModal" style="width: 80px;">Log in</button>
          <button type="button" class="btn btn-sm btn-success" data-toggle="modal" data-target="#signUpModal" style="width: 80px;">Sign up</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script>
import SearchBar from './SearchBar.vue'
import NotificationsDropdown from './NotificationsDropdown.vue'

export default {
  name: 'NavBar',
  components: {
    SearchBar,
    NotificationsDropdown
  },
  methods: {
    toggleNightMode() {
      this.$store.commit("toggleNightMode")
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
nav {
  background-color: #252525 !important;
}
.dropdown-menu-right {
  width: 190px;
  background: #252525;
  color: lightgrey;
}
.dropdown-menu-right > .dropdown-header {
  overflow-x: hidden;
  text-overflow: ellipsis;
}
@media (min-width: 992px) {
  nav {
    height: 45px;
  }
}
@media (max-width: 1199.98px) {
  #navbar-middle {
    display: none !important;
  }
}
</style>
