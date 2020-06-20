<template>
<div>
  <div class="container-fluid content-section" style="width: 98%;margin-bottom: 5px;">
    <div class="row">
      <div class="col-9" :style="{paddingTop: meme.caption ? '' : '18px'}">
        <h5 v-if="meme.caption" style="margin-top: .65rem;color: lightgrey;font-weight: 420;">{{ meme.caption }}</h5>
        <nuxt-link :to="'/user/' + meme.username" style="color: gainsboro;"><img v-if="meme.dp_url" class="rounded-circle" :src="meme.dp_url" height="24" width="24"><font-awesome-icon v-else :icon="['fas', 'user-circle']" style="font-size: 20px;" />&ensp;{{ meme.username }}</nuxt-link>
        <span v-if="meme.pname" class="text-muted" style="font-size: 14px;">&ensp;<font-awesome-icon :icon="['fas', 'caret-right']" />&ensp;<nuxt-link class="text-muted" :to="'/page/'+meme.pname">{{ meme.pdname || meme.pname }}</nuxt-link></span>
      </div>
      <div class="col-3 d-none d-lg-inline" id="rand-col" :style="{padding: meme.caption ? '20px' : '15px'}">
        <button @click="goToRandom" class="btn btn-sm btn-success float-right">Random <font-awesome-icon :icon="['far', 'arrow-alt-circle-right']" /></button>
      </div>
    </div>
  </div>

  <img
    v-if="['image/jpeg', 'image/png'].includes(meme.content_type)"
    class="content w-100"
    draggable="false"
    :src="meme.url"
    @click="$store.commit('setShowOverlay', true)"
    @contextmenu.prevent
    style="cursor: zoom-in;"
  >
  <video v-else ref="vidMeme" @contextmenu.prevent class="content w-100" style="max-height: 85vh;" loop :autoplay="isGif" :muted="isGif" :playsinline="isGif" :controls="!isGif" controlsList="nodownload" :preload="isGif ? 'auto' : 'metadata'">
    <source :src="meme.url">
  </video>

  <!-- ID is "comments" for scrolling to when URL has #comments hash -->
  <table class="content-section" id="comments" style="margin-bottom: 5px;">
    <tr>
      <td>
        <VoteButtons :points="meme.points" @set-points-event="setPoints" />
      </td>
      <td>
        <button class="btn btn-sm lower-btn" @click="copyLink">
          <template v-if="copyLinkClicked"><font-awesome-icon :icon="['fas', 'check']" /> Copied</template>
          <template v-else><font-awesome-icon :icon="['fas', 'link']" /> Copy Link</template>
        </button>
      </td>
      <td>
        <div class="dropdown float-right">
          <button class="btn lower-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
          </button>
          <div class="dropdown-menu bg-dark dropdown-dark">
            <nuxt-link class="dropdown-item" :to="'/img?m='+meme.uuid" target="_blank"><font-awesome-icon :icon="['fas', 'download']" /> Download</nuxt-link>
            <a class="dropdown-item" href="javascript:void(0);"><font-awesome-icon :icon="['far', 'flag']" /> Report</a>
            <a v-if="isOwnMeme || hasModPermissions" @click="deleteMeme" class="dropdown-item" href="javascript:void(0);">
              <font-awesome-icon :icon="['fas', 'trash-alt']" /> {{ isOwnMeme ? "Delete" : "Remove" }}
            </a>
          </div>
        </div>
      </td>
    </tr>
  </table>
  <span v-if="meme.tags.length" class="text-muted content-section pl-2">
    <button
      v-for="tag_name in meme.tags"
      :key="tag_name"
      @click="openLink(tag_name)"
      class="tag btn btn-sm btn-outline-primary mr-2"
    >
      #{{ tag_name }}
    </button>
  </span>
</div>
</template>

<script>
import VoteButtons from './VoteButtons'
import copy from 'copy-to-clipboard'

export default {
  name: 'MemeViewContainer',
  components: {
    VoteButtons,
  },
  props: {
    meme: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isGif: this.meme.content_type === "image/gif",
      copyLinkClicked: false
    }
  },
  computed: {
    isOwnMeme() {
      return this.$auth.loggedIn && this.meme.username === this.$auth.user.username
    },
    hasModPermissions() {
      return (this.meme.pname
              && this.$auth.loggedIn
              && this.$auth.user.moderating.find(p => p.name === this.meme.pname))
    }
  },
  methods: {
    goToRandom() {
      this.$axios.get("/api/random")
        .then(res => this.$router.push(`/m/${res.data.uuid}`))
        .catch(console.log)
    },
    setPoints(uuid, new_points_val) {
      this.$emit("set-points-event", uuid, new_points_val)
    },
    copyLink() {
      copy(window.location.href)
      this.copyLinkClicked = true
      setTimeout(() => this.copyLinkClicked = false, 1500)
    },
    openLink(tag_name) {
      window.open(`/search?q=%23${tag_name}`)
    },
    deleteMeme() {
      if (confirm(`Are you sure you want to ${this.isOwnMeme ? "delete" : "remove"} this meme?`)) {
        if (this.isOwnMeme) {
          this.$axios.delete(`/api/delete/meme/${this.tile.uuid}`)
            .then(res => {
              if (res.status === 204) {
                this.$router.push(this.meme.pname ? `/page/${this.meme.pname}` : "/")
                // Not actually an error, but using toast for errors
                this.errorToast("Meme has been deleted :(")
              }
            })
            .catch(this.displayError)
        } else {
          this.$axios.put(`/api/remove_meme/${this.$route.params.uuid}`)
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
.tag {
  padding: 3px;
  font-size: 12px;
}
.dropdown-item {
  cursor: pointer;
  font-size: 14px;
}
@media (max-width: 767.98px) {
  .dropdown {
    display: none;
  }
}
</style>
