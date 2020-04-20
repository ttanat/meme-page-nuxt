<template>
  <div class="col-md-4 col-xl-3" id="profile-col">

    <div class="container-fluid">
      <div class="row">
        <img v-if="isProfilePage && $auth.user.image" ref="profilePic" id="profile-pic" class="rounded-circle" :src="$auth.user.image" height="55" width="55">
        <img v-else-if="image && !isProfilePage" class="rounded-circle mt-1 ml-1 mr-2" :src="image" height="60" width="60">
        <font-awesome-icon v-else :icon="['fas', 'user-circle']" style="font-size: 60px;margin: 5px;" />
        <div>
          <h5 id="profile-username" class="m-1">{{ isProfilePage ? $auth.user.username : $route.params.username }}</h5>
          <template v-if="isProfilePage && pathname !== '/profile/settings'">
            <small class="text-muted pointer" @click="openInputPic">
              <template v-if="updatingPic">&nbsp;Updating <font-awesome-icon :icon="['fas', 'circle-notch']" spin /></template>
              <template v-else>&nbsp;Edit profile picture</template>
            </small>
            <input type="file" ref="inputPic" accept="image/jpeg, image/png" class="d-none" @change="updateProfilePic">
          </template>
          <FollowButton v-else :isFollowing="isFollowing" @following-changed-event="changeFollow" />
        </div>
      </div>
    </div>

    <div class="mt-2">
      <BioDescription v-if="isProfilePage" :bio-or-desc="bio" add-text="bio" />
      <span v-else style="font-size: 14px;white-space: pre-wrap;">{{ bio }}</span>
    </div>
    <hr class="mb-2" style="background-color: grey;">

    <UserStats v-if="pathname !== '/profile/settings'" :stats="stats" />

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
      <template v-if="isProfilePage && $auth.user.moderating.length">
        <h5>Meme Pages</h5>
        <nuxt-link v-for="m in $auth.user.moderating" :key="m.name" :to="'/page/'+m.name">
          <font-awesome-icon :icon="['fas', m.private ? 'lock' : 'star']" />&ensp;{{ m.dname || m.name }}
        </nuxt-link>
      </template>
      <template v-else-if="!isProfilePage && userPages.length">
        <h5>Meme Pages</h5>
        <nuxt-link v-for="p in userPages" :key="p.name" :to="'/page/'+p.name">
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

export default {
  name: 'ProfileSideBar',
  components: {
    UserStats,
    FollowButton,
    BioDescription
  },
  data() {
    return {
      image: null,
      isFollowing: false,
      bio: "",
      updatingPic: false,
      stats: {
        clout: 0,
        followers: 0,
        following: 0
      },
      userPages: this.isProfilePage ? this.$auth.user.moderating : [] // For user page only
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
  async created() {
    const response = await this.$axios.get(`/api/profile/user/?${this.isProfilePage ? "p=1" : `u=${this.$route.params.username}`}`)
    const res = response.data
    console.log(res)
    this.image = res.image
    this.bio = res.bio
    if (!this.isProfilePage) {
      this.isFollowing = res.is_following
      this.stats.clout = res.clout
      this.stats.followers = res.num_followers
      this.stats.following = res.num_following
      this.userPages.push(...res.moderating)
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
    },
    changeFollow(f) {
      this.isFollowing = f
      this.stats.followers += f ? 1 : -1
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
  margin: 5px;
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
  }
  #profile-col {
    overflow-y: auto;
  }
}
</style>
