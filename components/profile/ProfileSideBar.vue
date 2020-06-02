<template>
  <div class="col-md-4 col-xl-3" id="profile-col">
    <div class="container-fluid">
      <div class="row">
        <img v-if="isProfilePage && $auth.user.image" ref="profilePic" id="profile-pic" class="rounded-circle" :src="$auth.user.image" height="55" width="55">
        <img v-else-if="!isProfilePage && sidebarData.image" class="rounded-circle mt-1 ml-1 mr-2" :src="sidebarData.image" height="60" width="60">
        <font-awesome-icon v-else :icon="['fas', 'user-circle']" style="font-size: 60px;margin: 5px;" />
        <div>
          <h5 id="profile-username" class="m-1">{{ isProfilePage ? $auth.user.username : $route.params.username }}</h5>
          <template v-if="isProfilePage">
            <small class="text-muted pointer" @click="openInputPic">
              <template v-if="updatingPic">&nbsp;Updating <font-awesome-icon :icon="['fas', 'circle-notch']" spin /></template>
              <template v-else>&nbsp;Edit profile picture</template>
            </small>
            <input type="file" ref="inputPic" accept="image/jpeg, image/png" class="d-none" @change="updateProfilePic">
          </template>
          <FollowButton
            v-else
            :is-following="sidebarData.isFollowing"
            @following-changed-event="changeFollow"
          />
        </div>
      </div>
    </div>

    <div class="mt-2">
      <BioDescription
        v-if="isProfilePage"
        :current-bio="getBio"
        add-text="bio"
        @bio-change-event="changeBio"
      />
      <span v-else v-html="parseBio(getBio)" class="bio"></span>
    </div>
    <hr class="mb-2" style="background-color: grey;">

    <UserStats :stats="isProfilePage ? $auth.user.stats : sidebarData.stats" />

    <div class="mt-4 mb-5">
      <h5>Profile</h5>
      <template v-if="isProfilePage">
        <nuxt-link :class="{'sl-active': pathname === '/profile'}" to="/profile">
          <font-awesome-icon :icon="['fas', 'box-open']" />&ensp;Your memes
        </nuxt-link>
        <nuxt-link :class="{'sl-active': pathname === '/profile/likes'}" to="/profile/likes">
          <font-awesome-icon :icon="['fas', 'thumbs-up']" />&ensp;Likes
        </nuxt-link>
        <nuxt-link :class="{'sl-active': pathname === '/profile/comments'}" to="/profile/comments">
          <font-awesome-icon :icon="['fas', 'comment']" />&ensp;Comments
        </nuxt-link>
      </template>
      <nuxt-link v-else class="sidebar-link sl-active" to="">
        <font-awesome-icon :icon="['fas', 'box-open']" />&ensp;Memes
      </nuxt-link>
      <br>
      <template v-if="getPages.length">
        <h5>Meme Pages</h5>
        <nuxt-link v-for="p in getPages" :key="p.name" :to="'/page/'+p.name">
          <font-awesome-icon :icon="['fas', p.private ? 'lock' : 'star']" />&ensp;{{ p.dname || p.name }}
        </nuxt-link>
      </template>
    </div>
  </div>
</template>

<script>
import UserStats from './UserStats'
import FollowButton from './FollowButton'
import BioDescription from './BioDescription'
import parseBioMixin from '~/mixins/parseBioMixin'

export default {
  name: 'ProfileSideBar',
  components: {
    UserStats,
    FollowButton,
    BioDescription
  },
  props: {
    sidebarData: {
      type: Object,
      required: false
    }
  },
  mixins: [parseBioMixin],
  head() {
    return {
      meta: [
        {hid: "description", name: "description", content: this.bio},
        {hid: "keywords", name: "keywords", content: "Meme,Memes,Funny,Profile"}
      ]
    }
  },
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
    },
    getBio() {
      return this.isProfilePage ? this.$auth.user.bio : this.sidebarData.bio
    },
    getPages() {
      return this.isProfilePage ? this.$auth.user.moderating : this.sidebarData.userPages
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
        data.set("field", "image")
        data.set("image", file)

        this.$axios.post("/api/settings", data)
          .then(() => {
            // Add image to img element
            const new_src = URL.createObjectURL(file)
            this.$auth.setUser(Object.assign({}, this.$auth.user, {image: new_src}))
          })
          .catch(this.displayError)
          .finally(() => this.updatingPic = false)
      }
    },
    changeFollow(is_following) {
      this.isFollowing = is_following
      this.stats.followers += is_following ? 1 : -1
    },
    changeBio(b) {
      this.bio = b
    }
  }
}
</script>

<style scoped>
@import '~/assets/sidebar.css';
#profile-col {
  scrollbar-width: none;
}
#profile-col::-webkit-scrollbar {
  display: none;
}
#profile-pic {
  margin: 5px 5px 5px 0;
  display: block !important;
}
#profile-username {
  overflow: scroll;
  text-overflow: ellipsis;
  font-weight: normal;
}
@media (min-width: 767.98px) {
  #profile-col {
    position: sticky;
    position: -webkit-sticky;
    top: 4rem;
    height: 100%;
    overflow-y: auto;
    max-height: 90vh;
  }
}
.bio {
  font-size: 14px;
  white-space: pre-wrap;
}
</style>
