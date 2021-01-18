<template>
  <nav class="navbar navbar-expand-md navbar-dark justify-content-between" :class="{'sticky-top': !$store.state.showOverlay}">
    <nuxt-link class="navbar-brand ml-xl-4" to="/" no-prefetch>Meme Page</nuxt-link>
    <nuxt-link class="d-sm-none text-light" to="/" title="Home" no-prefetch><font-awesome-icon :icon="['fas', 'home']" /></nuxt-link>
    <SearchBar class="d-md-none" />
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
          <nuxt-link id="home-btn-right" class="nav-item nav-link text-light mr-3" to="/" title="Home" no-prefetch>
            <font-awesome-icon :icon="['fas', 'home']" fixed-width /><span class="d-md-none"> Home</span>
          </nuxt-link>
          <a v-if="$route.path.startsWith('/profile')" class="nav-item nav-link text-light mr-3 pointer" data-toggle="modal" data-target="#newMemePage" title="New meme page">
            <font-awesome-icon :icon="['fas', 'plus']" fixed-width /><span class="d-md-none"> New meme page</span>
          </a>
          <a class="nav-item nav-link text-light mr-3 pointer" data-toggle="modal" data-target="#uploadModal" :title="uploadingMeme ? 'Uploading...' : 'Upload'">
            <font-awesome-icon
              :icon="['fas', uploadingMeme ? 'circle-notch' : 'file-upload']"
              :spin="uploadingMeme"
              fixed-width
            />
            <span class="d-md-none"> {{ uploadingMeme ? "Uploading..." : "Upload" }}</span>
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
  height: 45px;
}
.navbar-toggler {
  padding: 0.25rem;
}
.navbar-toggler-icon {
  height: 20px;
}
@media (max-width: 575.98px) {
  .navbar-brand {
    display: none;
  }
}
@media (max-width: 767.98px) {
  nav {
    height: unset;
  }
  .navbar {
    padding: 0.25rem 0.5rem;
  }
  .navbar-brand {
    font-size: 1.1rem;
  }
  #home-btn-right {
    display: none;
  }
}
@media (max-width: 1199.98px) {
  #navbar-middle {
    display: none !important;
  }
}
</style>
