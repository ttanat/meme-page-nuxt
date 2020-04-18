<template>
  <div class="col-md-4 col-xl-3" id="profile-col">

    <div class="container-fluid">
      <div class="row">
        <img v-if="isProfilePage && $auth.user.image" ref="profilePic" class="rounded-circle" :src="$auth.user.image" height="55" width="55">
        <img v-else-if="!isProfilePage" class="rounded-circle" src="user_displayed.image.url" height="65" width="65">
        <font-awesome-icon v-else :icon="['fas', 'user-circle']" style="font-size: 60px;margin: 5px;" />
        <div>
          <h5 id="profile-username" class="m-1">user_displayed.username</h5>
          <template v-if="isProfilePage && pathname !== '/profile/settings'">
            <small class="text-muted pointer" @click="openInputPic">
              <template v-if="updatingPic">&nbsp;Updating <font-awesome-icon :icon="['fas', 'circle-notch']" spin /></template>
              <template v-else>&nbsp;Edit profile picture</template>
            </small>
            <input type="file" ref="inputPic" accept="image/jpeg, image/png" class="d-none" onchange="updateProfilePic">
          </template>
          <span v-else id="follow-btn"><follow-button :following="true" :is-profile="true"></follow-button></span>
        </div>
      </div>
    </div>

    <div class="mt-2">
      <div v-if="isProfilePage" id="vue-bio"><bio-desc bio-or-desc="user.bio" add-text="bio"></bio-desc></div>
      <span v-else style="font-size: 14px;white-space: pre-wrap;">user_displayed.bio</span>
    </div>
    <hr class="mb-2" style="background-color: grey;">

    <div v-if="pathname !== '/profile/settings'" id="pstats"><profile-stats></profile-stats></div>

    <div class="mt-4 mb-5">
      <h5>Profile</h5>
      <template v-if="isProfilePage">
        <nuxt-link :class="{'sl-active': pathname === '/profile'}" :to="pathname === '/profile' ? 'javascript:void(0);' : '/profile'" data-profile-page="Uploads">
          <font-awesome-icon :icon="['fas', 'box-open']" />&ensp;Your memes
        </nuxt-link>
        <nuxt-link :class="{'sl-active': pathname === '/profile/likes'}" :to="pathname === '/profile/likes' ? 'javascript:void(0);' : '/profile/likes'" data-profile-page="Likes">
          <font-awesome-icon :icon="['fas', 'thumbs-up']" />&ensp;Likes
        </nuxt-link>
        <nuxt-link :class="{'sl-active': pathname === '/profile/comments'}" :to="pathname === '/profile/comments' ? 'javascript:void(0);' : '/profile/comments'" data-profile-page="Comments">
          <font-awesome-icon :icon="['fas', 'comment']" />&ensp;Comments
        </nuxt-link>
      </template>
      <a v-else class="sidebar-link sl-active" href="javascript:void(0);" data-profile-page="Uploads">
        <font-awesome-icon :icon="['fas', 'box-open']" />&ensp;Memes
      </a>
      <br>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileSideBar',
  data() {
    return {
      updatingPic: false
    }
  },
  computed: {
    pathname() {
      return this.$route.path
    },
    isProfilePage() {
      return this.$auth.loggedIn && this.pathname.startsWith("/profile")
    }
  },
  methods: {
    openInputPic() {
      this.$refs.inputPic.click()
    },
    updateProfilePic() {
      const file = this.$refs.inputPic.files[0]
      if (!file) {
        alert("Please select a file.")
      } else if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Supported media types: JPEG, PNG")
      } else if (confirm('Are you sure you want to change your profile picture?')) {
        this.updatingPic = true
        const data = new FormData()
        data.set("img", file)

        axios.post("/settings?f=image", data, {headers: {"X-CSRFToken": getCookie('csrftoken'), "X-Requested-With": "XMLHttpRequest"}})
          .then(() => {
            // Add image to img element
            this.$refs.profilePic.onload = function() {
              URL.revokeObjectURL(this.src)
            }
            const new_src = URL.createObjectURL(file)
            this.$auth.user.image = new_src
            // Change profile picture in nav bar
            // const pi = document.querySelector("#profile-image");
            // if (pi.firstChild.tagName !== "IMG") pi.innerHTML = `<img class="rounded-circle" id="profile-image" height="21" width="21">`;
            // pi.firstChild.src = new_src;
          })
          .catch(err => console.log(err.response.data || err))
          .finally(() => this.updatingPic = false)
      }
    }
  }
}
</script>

<style scoped>
@import '~/assets/sidebar.css';
</style>
