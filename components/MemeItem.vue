<template>
  <div class="item">
    <div class="item-header">
      <!-- Username -->
      <nuxt-link v-if="meme.username" :to="'/user/'+meme.username" class="header-username" no-prefetch>
        <img v-if="meme.dp_url" class="rounded-circle user-img" :src="meme.dp_url" height="18" width="18">
        <font-awesome-icon v-else :icon="['fas', 'user-circle']" style="font-size: 15px;" /><!-- Comment here to remove whitespace
     -->&nbsp;{{ meme.username }}
      </nuxt-link>
      <!-- Username if user is deleted -->
      <span v-else class="header-username">
        <font-awesome-icon :icon="['fas', 'user-circle']" style="font-size: 15px;" />
        [REDACTED]
      </span>
      <!-- Page name and display name if applicable -->
      <span v-if="meme.pname" class="header-page">
        &ensp;<font-awesome-icon :icon="['fas', 'caret-right']" />&nbsp;
        <nuxt-link :to="'/p/'+meme.pname" class="header-page" no-prefetch>
          {{ meme.pname }}
        </nuxt-link>
      </span>
      <!-- Caption -->
      <h6
        v-for="(captionFragment, i) in captionFragments"
        :key="i"
        :class="{'caption-first-line': i === 0}"
        class="caption"
        :style="{'margin-bottom': i === captionFragments.length - 1 ? '' : '4px'}"
      >
        {{ captionFragment }}
      </h6>
    </div>

    <div @contextmenu.prevent="openContextMenu" class="item-body" :class="{'item-body-loading': loading}" :style="{backgroundColor: isVideo ? '#111' : ''}">
      <template v-if="isVideo">
        <nuxt-link @click.prevent="vidClick" :to="memeLink" target="_blank" class="item-body-link" draggable="false">
          <video ref="memeEl" draggable="false" class="content autoplay" controlsList="nodownload" :muted="muted" loop playsinline @loadeddata="memeLoaded" style="max-height: 70vh;">
            <source :data-src="meme.url">
          </video>
        </nuxt-link>
        <div v-if="paused && !loading" @click="togglePlayback" class="rounded-circle play-circle" :style="{paddingLeft: isGif ? '' : '.35rem'}">
          <h5 v-if="isGif">GIF</h5><font-awesome-icon v-else :icon="['fas', 'play']" class="play-icon" />
        </div>
        <font-awesome-icon v-if="!isGif" @click="$emit('toggle-sound-event')" :icon="['fas', muted ? 'volume-mute' : 'volume-up']" class="sound-toggle" />
      </template>
      <nuxt-link v-else :to="memeLink" target="_blank" class="item-body-link" draggable="false">
        <img
          ref="memeEl"
          @load="memeLoaded"
          draggable="false"
          :data-srcset="meme.fallback ? meme.url : ''"
          :data-src="meme.fallback || meme.url"
          class="content fade-in"
          loading="lazy"
        >
      </nuxt-link>
      <div v-if="loading" class="loading p-0"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
    </div>

    <table>
      <tr>
        <td>
          <button @click="vote('l')" :class="{green: isLiked}" class="btn btn-sm lower-btn thumbs like pr-0">
            <font-awesome-icon :icon="[isLiked ? 'fas' : 'far', 'thumbs-up']" />
          </button>
          <span style="color: #888;">&nbsp;<span class="points">{{ formatNumber(meme.points) }}</span></span>
        </td>
        <td>
          <button @click="vote('d')" :class="{red: isDisliked}" class="btn btn-sm lower-btn thumbs dislike">
            <font-awesome-icon :icon="[isDisliked ? 'fas' : 'far', 'thumbs-down']" />
          </button>
        </td>
        <td>
          <nuxt-link class="btn btn-sm lower-btn" :to="memeLink+'#comments'" target="_blank">
            <font-awesome-icon :icon="['far', 'comment']" />&nbsp;{{ formatNumber(meme.num_comments) }}
          </nuxt-link>
        </td>
        <td v-if="isVideo">
          <button @click="restartVid" class="btn btn-sm lower-btn" title="Restart playback">
            <font-awesome-icon :icon="['fas', 'undo']" />
          </button>
        </td>
        <td>
          <div class="dropdown">
            <button class="btn lower-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
            </button>
            <div class="dropdown-menu bg-dark dropdown-dark" @contextmenu.prevent>
              <nuxt-link class="dropdown-item" :to="'/img?m='+meme.uuid" target="_blank"><font-awesome-icon :icon="['fas', 'download']" /> Download</nuxt-link>
              <div class="dropdown-item" @click="copyLink"><font-awesome-icon :icon="['fas', 'link']" /> Copy Link</div>
              <div v-if="$auth.loggedIn && !isOwnMeme" class="dropdown-item" @click="report"><font-awesome-icon :icon="['far', 'flag']" /> Report</div>
              <div v-if="canRemove" class="dropdown-item" @click="removeMeme"><font-awesome-icon :icon="['fas', 'trash-alt']" /> Remove</div>
            </div>
          </div>
        </td>
        <td>
          <SocialButtons :meme="meme" />
        </td>
      </tr>
    </table>
    <vue-context ref="menu">
      <li>
        <a :href="memeLink" target="_blank">
          <font-awesome-icon :icon="['fas', 'external-link-alt']" />&ensp;Open in new tab
        </a>
      </li>
      <li>
        <a href="javascript:void(0);" @click="copyLink">
          <font-awesome-icon :icon="['fas', 'link']" />&ensp;Copy link
        </a>
      </li>
      <li>
        <a :href="'/img?m='+meme.uuid" target="_blank">
          <font-awesome-icon :icon="['fas', 'download']" />&ensp;Download
        </a>
      </li>
      <li v-if="$auth.loggedIn && !isOwnMeme">
        <a href="javascript:void(0);" @click="report">
          <font-awesome-icon :icon="['fas', 'flag']" />&ensp;Report
        </a>
      </li>
      <li v-if="canRemove">
        <a href="javascript:void(0);" @click="removeMeme">
          <font-awesome-icon :icon="['fas', 'trash-alt']" />&ensp;Remove
        </a>
      </li>
    </vue-context>
  </div>
</template>

<script>
import voteMixin from '~/mixins/voteMixin'
import copy from 'copy-to-clipboard'
import VueContext from 'vue-context'
import formatNumberMixin from '~/mixins/formatNumberMixin'
import urlFileExtMixin from '~/mixins/urlFileExtMixin'
import SocialButtons from '~/components/meme_view/SocialButtons'

export default {
  name: 'Meme',
  components: {
    VueContext,
    SocialButtons,
  },
  props: {
    meme: {
      type: Object,
      required: true
    },
    muted: {
      type: Boolean,
      required: true
    }
  },
  mixins: [formatNumberMixin, voteMixin, urlFileExtMixin],
  data() {
    return {
      isLiked: this.meme.vote === 1,
      isDisliked: this.meme.vote === -1,
      isVideo: this.checkUrlIsVideo(this.meme.url),
      isGif: !!this.meme.is_gif,
      paused: true,
      loading: true,
      captionFragments: this.meme.caption.split(/(?:\r\n|\r|\n)/g) // Split new lines
    }
  },
  mounted() {
    this.$emit("new-meme-event", this.$refs.memeEl, this.isVideo)
  },
  computed: {
    memeLink() {
      return `/m/${this.meme.uuid}`
    },
    isOwnMeme() {
      return this.$auth.loggedIn && this.meme.username === this.$auth.user.username
    },
    canRemove() {
      // Check if user can remove meme from page
      // Meme must be posted to a page and user must be an admin/moderator of that page
      if (this.$route.path.startsWith("/p/")) {
        return this.$auth.loggedIn && this.$auth.user.moderating.find(page => page.name === this.$route.params.name)
      } else {
        return this.meme.pname && this.$auth.loggedIn && this.$auth.user.moderating.find(page => page.name === this.meme.pname)
      }
    }
  },
  methods: {
    memeLoaded() {this.loading = false},
    vidClick() {this.paused ? this.togglePlayback() : window.open(this.memeLink)},
    togglePlayback(play=true) {
        this.paused = !play
        play ? this.$refs.memeEl.play() : this.$refs.memeEl.pause()
    },
    copyLink() {
      copy(`${window.location.origin}${this.memeLink}`)
      this.successToast("Copied")
    },
    report() {
      this.$store.commit("report/setNewReport", {
        reportObject: "meme",
        objectUid: this.meme.uuid
      })
    },
    vote(v) {this.sendVote(this.meme, v, "m")},
    restartVid() {this.$refs.memeEl.currentTime = 0},
    async openContextMenu(e) {
      // Close all other context menus first
      await this.$emit("context-menu-event")
      this.$refs.menu.open(e)
    },
    removeMeme() {
      const pageName = this.meme.pname || this.$route.params.name
      if (!pageName) return false

      if (confirm(`Are you sure you want to remove this meme from ${pageName}?`)) {
        this.$axios.put(`/api/mods/remove/meme/${this.meme.uuid}`)
          .then(() => {
            this.$toast.info(`Meme removed from ${pageName}`, {
              position: 'top-center',
              duration: 1500
            })
            if (this.$route.path === `/p/${pageName}`) {
              // Remove meme if in page
              this.$emit("remove-meme-event", this.meme.uuid)
            } else {
              // Remove page name
              this.meme.pname = ""
            }
          })
          .catch(err => err.response ? this.errorToast(err.response.data) : console.log(err))
      }
    }
  }
}
</script>

<style scoped>
@import  'vue-context/dist/css/vue-context.css';
.item {
  background-color: #191919;
  border: 1px solid #333;
  border-radius: 7px;
}
.item-header {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  font-weight: 350;
}
.header-username, .header-page {
  font-size: 13px;
  color: #888;
}
.user-img {
  margin-bottom: .2rem;
}
.caption-first-line {
  margin-top: .3rem;
}
.caption {
  font-size: 1.1rem;
  font-weight: 420;
  overflow-wrap: break-word; /* If word is too long, it will go on new line */
  color: gainsboro;
}
.item-body {
  max-height: 30rem;
  position: relative;
}
.item-body-loading {
  height: 80vh;
  position: relative;
}
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
}
.item-body-link {
  max-height: inherit;
}
.content {
  width: 100%;
  margin-bottom: 0;
  max-height: inherit;
  object-fit: contain;
}
.play-circle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  opacity: .7;
  background-color: black;
  height: 5rem;
  width: 5rem;
  text-align: center;
  padding-top: 1.75rem;
  cursor: pointer;
}
.play-icon {
  font-size: 1.5rem;
}
.sound-toggle {
  position: absolute;
  right: .5rem;
  bottom: .5rem;
  font-size: 1.25rem;
  cursor: pointer;
  text-shadow: .1rem .1rem .2rem #111;
}
.thumbs {
  margin-left: 5px;
}
.v-context {
  font-size: 14.5px;
}
.dropdown-item {
  cursor: pointer;
  font-size: 14px;
}
@media (max-width: 575.98px) {
  .item {
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
  /* .content {
    object-fit: unset;
  } */
  .header-username, .header-page, .lower-btn, .points {
    font-size: 12px;
  }
  .caption {
    font-size: .9rem;
  }
}
</style>
