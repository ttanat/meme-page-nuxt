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
          <a type="button" class="nav-item nav-link text-light mr-3" data-toggle="modal" data-target="#uploadModal" :title="uploadingMeme ? 'Uploading...' : 'Upload'">
            <font-awesome-icon
              :icon="['fas', uploadingMeme ? 'circle-notch' : 'file-upload']"
              :spin="uploadingMeme"
              fixed-width
            />
            <span class="d-lg-none"> {{ uploadingMeme ? "Uploading..." : "Upload" }}</span>
          </a>
          <NotificationsDropdown />
          <UserDropdown />
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
import UserDropdown from './UserDropdown.vue'

export default {
  name: 'NavBar',
  components: {
    SearchBar,
    NotificationsDropdown,
    UserDropdown
  },
  computed: {
    uploadingMeme() {
      return this.$store.getters.uploadingMeme
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
