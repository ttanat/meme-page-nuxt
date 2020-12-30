<template>
  <div class="col-md-4 col-xl-3" id="profile-col">
    <div class="container-fluid">
      <div class="row">
        <!-- Profile picture -->
        <img v-if="isProfilePage && $auth.user.image" ref="profilePic" id="profile-pic" class="rounded-circle" :src="$auth.user.image" height="55" width="55">
        <img v-else-if="!isProfilePage && sidebarData.image" class="rounded-circle mt-1 ml-1 mr-2" :src="sidebarData.image" height="60" width="60">
        <font-awesome-icon v-else :icon="['fas', 'user-circle']" style="font-size: 60px;margin: 5px;" />
        <div>
          <!-- Username -->
          <h5 id="profile-username" class="m-1">{{ getUsername }}</h5>
          <!-- Button for updating profile picture -->
          <template v-if="isProfilePage">
            <small class="text-muted pointer" @click="updatingPic ? '' : $refs.inputPic.click()">
              <template v-if="updatingPic">&nbsp;Updating <font-awesome-icon :icon="['fas', 'circle-notch']" spin /></template>
              <template v-else>&nbsp;Edit profile picture</template>
            </small>
            <input v-show="false" type="file" ref="inputPic" accept="image/jpeg, image/png" @change="updateProfilePic">
          </template>
          <div v-else-if="!banned" class="row ml-0">
            <!-- Follow button -->
            <FollowButton
              :is-following="sidebarData.isFollowing"
              @following-changed-event="changeFollow"
            />
            <!-- Dropdown for copying link and reporting -->
            <div class="dropdown">
              <button class="btn lower-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
              </button>
              <div class="dropdown-menu bg-dark dropdown-dark" @contextmenu.prevent>
                <div class="dropdown-item" @click="copyLink"><font-awesome-icon :icon="['fas', 'link']" /> Copy Link</div>
                <div v-if="$auth.loggedIn && !isProfilePage" class="dropdown-item" @click="report"><font-awesome-icon :icon="['far', 'flag']" /> Report</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!banned" class="mt-2">
      <BioDescription
        v-if="isProfilePage"
        add-text="bio"
      />
      <span v-else v-html="parseBio(getBio)" class="bio"></span>
    </div>
    <hr class="mb-2" style="background: grey;">

    <UserStats v-if="!banned" :stats="isProfilePage ? $auth.user.stats : sidebarData.stats" />

    <div class="mt-4" :class="[isProfilePage ? 'mb-4' : 'mb-5']">
      <h5>Profile</h5>
      <template v-if="isProfilePage">
        <nuxt-link :class="{'sl-active': pathname === '/profile'}" to="/profile">
          <font-awesome-icon :icon="['fas', 'box-open']" />&ensp;Your memes
        </nuxt-link>
        <nuxt-link :class="{'sl-active': pathname === '/profile/likes'}" to="/profile/likes" no-prefetch>
          <font-awesome-icon :icon="['fas', 'thumbs-up']" />&ensp;Likes
        </nuxt-link>
        <nuxt-link :class="{'sl-active': pathname === '/profile/comments'}" to="/profile/comments" no-prefetch>
          <font-awesome-icon :icon="['fas', 'comment']" />&ensp;Comments
        </nuxt-link>
        <nuxt-link :class="{'sl-active': pathname === '/profile/private'}" to="/profile/private" no-prefetch>
          <font-awesome-icon :icon="['fas', 'lock']" />&ensp;Private
        </nuxt-link>
      </template>
      <nuxt-link v-else class="sidebar-link sl-active" to="">
        <font-awesome-icon :icon="['fas', 'box-open']" />&ensp;Memes
      </nuxt-link>
      <template v-if="getPages.length">
        <br>
        <h5>Meme Pages</h5>
        <nuxt-link v-for="p in getPages" :key="p.name" :to="'/p/'+p.name" no-prefetch>
          <font-awesome-icon :icon="['fas', p.private ? 'lock' : 'star']" />&ensp;{{ p.dname || p.name }}
        </nuxt-link>
      </template>
    </div>

    <div v-if="isProfilePage" class="text-muted pointer mb-5" @click="copyLink" title="Copy profile link" style="font-size: 14px;">
      Copy link <font-awesome-icon :icon="['fas', 'link']" />
    </div>
  </div>
</template>

<script>
import UserStats from './UserStats'
import FollowButton from './FollowButton'
import BioDescription from './BioDescription'
import parseBioMixin from '~/mixins/parseBioMixin'
import copy from 'copy-to-clipboard'

export default {
  name: 'ProfileSideBar',
  components: {
    UserStats,
    FollowButton,
    BioDescription
  },
  props: {
    banned: {
      type: Boolean,
      required: false,
      default: false
    },
    sidebarData: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  mixins: [parseBioMixin],
  head() {
    const meta = [
      // Twitter meta tags
      {hid: "twitter:card", name: "twitter:card", content: "summary"},
      {hid: "twitter:url", name: "twitter:url", content: `${window.location.origin}/u/${this.getUsername}`}, // Ensure not /profile
      {hid: "twitter:title", name: "twitter:title", content: `${this.getUsername} - Meme Page`},
      {hid: "twitter:description", name: "twitter:description", content: this.getBio},
      {hid: "twitter:image", name: "twitter:image", content: this.getImage},
      // Open graph meta tags
      {hid: "og:url", property: "og:url", content: `${window.location.origin}/u/${this.getUsername}`}, // Ensure not /profile
      {hid: "og:type", property: "og:type", content: "profile"},
      {hid: "og:title", property: "og:title", content: `${this.getUsername} - Meme Page`},
      {hid: "og:image", property: "og:image", content: this.getImage},
      {hid: "og:description", property: "og:description", content: this.getBio},
    ]
    if (this.getBio) meta.push({hid: "description", name: "description", content: this.getBio})
    return { meta }
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
    getUsername() {
      return this.isProfilePage ? this.$auth.user.username : this.$route.params.username
    },
    getImage() {
      return (this.isProfilePage ? this.$auth.user.image : this.sidebarData.image) || ""
    },
    getBio() {
      return (this.isProfilePage ? this.$auth.user.bio : this.sidebarData.bio) || ""
    },
    getPages() {
      return this.isProfilePage ? this.$auth.user.moderating : this.sidebarData.userPages || []
    }
  },
  methods: {
    updateProfilePic() {
      if (this.updatingPic) return false
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
            this.$setUserField({image: new_src})
          })
          .catch(this.displayError)
          .finally(() => this.updatingPic = false)
      }
    },
    changeFollow(is_following) {
      this.$emit('following-changed-event', is_following)
    },
    copyLink() {
      copy(`${window.location.origin}${this.isProfilePage ? `/u/${this.$auth.user.username}` : window.location.pathname}`)
      this.successToast("Copied")
    },
    report() {
      this.$store.commit("report/setNewReport", {
        reportObject: "user",
        objectUid: this.$route.params.username
      })
    }
  }
}
</script>

<style src="~/assets/sidebar.css" scoped></style>
<style scoped>
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
.dropdown-item {
  cursor: pointer;
  font-size: 14px;
}
.bio {
  font-size: 14px;
  white-space: pre-wrap;
}
</style>
