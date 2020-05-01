<template>
  <nav class="navbar sticky-top navbar-expand-lg navbar-dark justify-content-between">
    <nuxt-link class="navbar-brand ml-xl-4" to="/">Meme Page</nuxt-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">

      <div id="navbar-middle" class="navbar-nav collapse navbar-collapse justify-content-center">
        <a class="nav-item nav-link mr-3 pointer">{{ $store.state.current_page }}</a>
        <SearchBar />
      </div>

      <div class="navbar-nav ml-auto mr-lg-0 mr-xl-3">
        <template v-if="$auth.loggedIn">
          <nuxt-link class="nav-item nav-link text-light mr-3" to="/"><font-awesome-icon :icon="['fas', 'home']" /> Home</nuxt-link>
          <a v-if="$route.path.startsWith('/profile')" type="button" class="nav-item nav-link text-light mr-3" data-toggle="modal" data-target="#newMemePage">
            <font-awesome-icon :icon="['fas', 'plus']" /> Meme Page
          </a>
          <a type="button" class="nav-item nav-link text-light mr-3" data-toggle="modal" data-target="#uploadModal">
            <font-awesome-icon :icon="['fas', 'file-upload']" /> Upload
          </a>
          <NotificationsDropdown />
          <div class="dropdown">
            <a type="button" class="nav-item nav-link text-light mr-2" data-toggle="dropdown">
              <img v-if="$auth.user.image" class="rounded-circle" :src="$auth.user.image" height="21" width="21">
              <font-awesome-icon v-else :icon="['fas', 'user-circle']" />&nbsp;{{ showUsername }}&nbsp;<font-awesome-icon :icon="['fas', 'caret-down']" />
            </a>
            <div class="dropdown-menu dropdown-menu-right" style="width: 190px;background-color: #252525;color: lightgrey;">
              <h5 class="dropdown-header m-0" style="overflow-x: hidden;text-overflow: ellipsis;">{{ $auth.user.username }}</h5>
              <nuxt-link class="dropdown-item user-dropdown" to="/profile"><font-awesome-icon :icon="['fas', 'user']" /> Profile</nuxt-link>
              <a class="dropdown-item user-dropdown" href="javascript:night()"><font-awesome-icon id="moon-icon" :icon="['far', 'moon']" /> Night</a>
              <nuxt-link class="dropdown-item user-dropdown" to="/settings"><font-awesome-icon :icon="['fas', 'cog']" /> Settings</nuxt-link>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item user-dropdown" @click="$auth.logout()" href="#"><font-awesome-icon :icon="['fas', 'sign-out-alt']" /> Logout</a>
            </div>
          </div>
        </template>
        <template v-else>
          <button class="btn btn-sm mr-3" style="width: 100px;visibility: hidden;"></button>
          <button type="button" class="btn btn-sm btn-outline-success mr-3" data-toggle="modal" data-target="#loginModal" style="width: 80px;">Log in</button>
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
  computed: {
    showUsername() {
      return this.$auth.user.username.length < 7 ? this.$auth.user.username : ""
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
nav {
  background-color: #252525 !important;
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
