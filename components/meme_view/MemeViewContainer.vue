<template>
<div>
  <div class="container-fluid content-section" style="width: 98%;margin-bottom: 5px;">
    <div style="margin-top: .65rem;">
      <!-- Username -->
      <nuxt-link :to="'/user/' + meme.username" style="color: #aaa;">
        <img v-if="meme.dp_url" class="rounded-circle" :src="meme.dp_url" height="24" width="24">
        <font-awesome-icon v-else :icon="['fas', 'user-circle']" style="font-size: 20px;" />&ensp;{{ meme.username }}
      </nuxt-link>
      <!-- Page if applicable -->
      <span v-if="meme.pname" class="text-muted" style="font-size: 15px;">
        &ensp;<font-awesome-icon :icon="['fas', 'caret-right']" />
        &nbsp;<nuxt-link class="text-muted" :to="'/page/'+meme.pname">{{ meme.pdname || meme.pname }}</nuxt-link>
      </span>
      <!-- Dropdown -->
      <div class="dropdown float-right" style="margin-top: -4px">
        <button class="btn btn-sm lower-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
        </button>
        <div class="dropdown-menu bg-dark dropdown-dark">
          <nuxt-link class="dropdown-item" :to="'/img?m='+meme.uuid" target="_blank"><font-awesome-icon :icon="['fas', 'download']" /> Download</nuxt-link>
          <a class="dropdown-item" @click="copyLinkDropdown"><font-awesome-icon :icon="['fas', 'link']" /> Copy link</a>
          <a class="dropdown-item" href="javascript:void(0);"><font-awesome-icon :icon="['far', 'flag']" /> Report</a>
          <a v-if="isOwnMeme || hasModPermissions" @click="deleteMeme" class="dropdown-item" href="javascript:void(0);">
            <font-awesome-icon :icon="['fas', 'trash-alt']" /> {{ isOwnMeme ? "Delete" : "Remove" }}
          </a>
        </div>
      </div>
    </div>
    <!-- Caption -->
    <h5 v-for="(cf, i) in captionFragments" :key="i" class="mt-1 caption">{{ cf }}</h5>
  </div>

  <img
    v-if="isImage"
    class="content w-100 mt-1"
    draggable="false"
    :srcset="meme.fallback ? meme.url : ''"
    :src="meme.fallback || meme.url"
    @click="$store.commit('setShowOverlay', true)"
    @contextmenu.prevent
    style="cursor: zoom-in;"
  >
  <video v-else
    ref="vidMeme"
    @contextmenu.prevent
    class="content w-100 mt-1"
    style="max-height: 85vh;background: black;"
    loop
    :autoplay="isGif"
    :muted="isGif"
    :playsinline="isGif"
    :controls="!isGif"
    controlsList="nodownload"
    :preload="isGif ? 'auto' : 'metadata'"
  >
    <source :src="meme.url">
  </video>

  <!-- ID is "comments" for scrolling to when URL has #comments hash -->
  <table class="content-section" id="comments" :style="{marginBottom: meme.tags.length ? '' : '4px'}">
    <tr>
      <td>
        <!-- set-points-event called from voteMixin -->
        <VoteButtons @set-points-event="setPoints" :vote-on-load="meme.vote" />
      </td>
      <td>
        <button @click="copyLink" class="btn btn-sm lower-btn mr-2">
          <template v-if="copyLinkClicked"><font-awesome-icon :icon="['fas', 'check']" />&ensp;Copied</template>
          <template v-else><font-awesome-icon :icon="['fas', 'link']" />&ensp;Copy Link</template>
        </button>
      </td>
      <td>
        <SocialButtons :meme="meme" />
      </td>
    </tr>
  </table>
  <div v-if="meme.tags.length" class="text-muted content-section pl-2">
    <button
      v-for="tag_name in meme.tags"
      :key="tag_name"
      @click="openLink(tag_name)"
      class="tag btn btn-sm btn-outline-primary mr-2 mt-2"
    >
      #{{ tag_name }}
    </button>
  </div>
</div>
</template>

<script>
import VoteButtons from './VoteButtons'
import copy from 'copy-to-clipboard'
import { mapGetters } from 'vuex'
import urlFileExtMixin from '~/mixins/urlFileExtMixin'
import SocialButtons from './SocialButtons'

export default {
  name: 'MemeViewContainer',
  components: {
    VoteButtons,
    SocialButtons,
  },
  mixins: [urlFileExtMixin],
  data() {
    return {
      copyLinkClicked: false,
      showSocial: false
    }
  },
  computed: {
    ...mapGetters({meme: "meme/meme"}),
    isImage() {
      return this.checkUrlIsImage(this.meme.url)
    },
    isGif() {
      return !!this.meme.is_gif
    },
    isOwnMeme() {
      return this.$auth.loggedIn && this.meme.username === this.$auth.user.username
    },
    hasModPermissions() {
      return (this.meme.pname
              && this.$auth.loggedIn
              && this.$auth.user.moderating.find(p => p.name === this.meme.pname))
    },
    captionFragments() {
      return this.meme.caption.split(/(?:\r\n|\r|\n)/g) // Split new lines
    }
  },
  methods: {
    goToRandom() {
      this.$axios.get("/api/random")
        .then(res => this.$router.push(`/m/${res.data.uuid}`))
        .catch(console.log)
    },
    setPoints(_, new_points_val) {
      this.$store.commit("meme/setPoints", new_points_val)
    },
    copyLink() {
      copy(`${window.location.origin}${window.location.pathname}`)
      this.copyLinkClicked = true
      setTimeout(() => this.copyLinkClicked = false, 1500)
    },
    copyLinkDropdown() {
      copy(`${window.location.origin}${window.location.pathname}`)
      this.$toast.success("Copied", {
        position: 'top-center',
        duration: 1500
      })
    },
    openLink(tag_name) {
      window.open(`/search?q=%23${tag_name}`)
    },
    deleteMeme() {
      const hasPage = this.isOwnMeme ? "" : ` from ${this.meme.pdname || this.meme.pname}`

      if (confirm(`Are you sure you want to ${this.isOwnMeme ? "delete" : "remove"} this meme${hasPage}?`)) {
        // Show toast to user
        this.$toast.info(`${this.isOwnMeme ? "Deleting" : "Removing"} meme...`, {
          position: 'top-center',
          duration: 1500
        })
        if (this.isOwnMeme) {
          // Delete meme
          this.$axios.delete(`/api/delete/meme/${this.$route.params.uuid}`)
            .then(res => {
              if (res.status === 204) {
                this.$router.push(this.meme.pname ? `/page/${this.meme.pname}` : "/")
                // Not actually an error, but using toast for errors
                this.errorToast("Meme has been deleted :(")
              }
            })
            .catch(this.displayError)
        } else {
          // Remove meme from page
          this.$axios.put(`/api/mods/remove/meme/${this.$route.params.uuid}`)
            .then(() => {
              this.$router.push(`/page/${this.meme.pname}`)
              this.$toast.info(`Meme removed from ${this.meme.pdname || this.meme.pname}`, {
                position: 'top-center',
                duration: 1500
              })
            })
            .catch(err => err.response ? this.errorToast(err.response.data) : console.log(err))
        }
      }
    }
  }
}
</script>

<style scoped>
.caption {
  color: lightgrey;
  font-weight: 420;
  margin-bottom: 4px;
}
.tag {
  padding: 3px 7px 3px 7px;
  font-size: 14px;
  border-radius: 15px;
}
.dropdown-item {
  cursor: pointer;
  font-size: 14px;
}
</style>
