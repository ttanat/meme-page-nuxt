<template>
  <div class="item">
    <div class="item-header">
      <a :href="'/user/' + meme.username" class="header-username"><img v-if="meme.dp_url" class="rounded-circle" :src="meme.dp_url" height="18" width="18"><font-awesome-icon v-else :icon="['fas', 'user-circle']" style="font-size: 15px;" />&nbsp;{{ meme.username }}</a><template v-if="meme.pname"><span class="header-page">&ensp;<font-awesome-icon :icon="['fas', 'caret-right']" />&ensp;<a :href="'/page/'+meme.pname" class="header-page">{{ meme.pdname || meme.pname }}</a></span></template>
      <h6 class="mt-2 caption">{{ meme.caption }}</h6>
    </div>

    <div ref="cbody" @contextmenu.prevent="openContextMenu" class="item-body" :style="{backgroundColor: isVideo ? '#111' : ''}" style="height: 80vh;">
      <template v-if="isVideo">
        <nuxt-link @click.prevent="vidClick" :to="'/m/'+meme.uuid" target="_blank" class="item-body-link" draggable="false">
          <video ref="memeEl" draggable="false" class="content autoplay" controlsList="nodownload" :muted="muted" loop playsinline @loadeddata="rmCBodyHeight" style="max-height: 70vh;">
            <source :data-src="meme.url">
          </video>
        </nuxt-link>
        <div v-if="paused" @click="togglePlayback" class="rounded-circle play-circle" :style="{paddingLeft: isGif ? '' : '.35rem'}">
          <h5 v-if="isGif">GIF</h5><font-awesome-icon v-else :icon="['fas', 'play']" class="play-icon" />
        </div>
        <font-awesome-icon v-if="!isGif" @click="$emit('toggle-sound-event')" :icon="['fas', muted ? 'volume-mute' : 'volume-up']" class="sound-toggle" />
      </template>
      <nuxt-link v-else :to="'/m/'+meme.uuid" target="_blank" class="item-body-link" draggable="false">
        <img ref="memeEl" @load="rmCBodyHeight" draggable="false" :data-srcset="meme.url" data-src="/media/users/john/profile/ivz59jjdeht31.jpg" class="content fade-in" loading="lazy">
      </nuxt-link>
    </div>

    <table>
      <tr>
        <td>
          <button @click="vote('l')" :class="{green: isLiked}" class="btn btn-sm lower-btn thumbs like pr-0">
            <font-awesome-icon :icon="[isLiked ? 'fas' : 'far', 'thumbs-up']" />
          </button>
          <span class="text-muted">&nbsp;<span class="points">{{ meme.points }}</span></span>
        </td>
        <td>
          <button @click="vote('d')" :class="{red: isDisliked}" class="btn btn-sm lower-btn thumbs dislike">
            <font-awesome-icon :icon="[isDisliked ? 'fas' : 'far', 'thumbs-down']" />
          </button>
        </td>
        <td>
          <nuxt-link class="btn btn-sm lower-btn" :to="'/m/'+meme.uuid+'#comments'" target="_blank">
            <font-awesome-icon :icon="['far', 'comment']" />&nbsp;{{ meme.num_comments }}
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
            <div class="dropdown-menu bg-dark" @contextmenu.prevent>
              <nuxt-link class="dropdown-item m-dropdown" :to="'/img?m='+meme.uuid" target="_blank"><font-awesome-icon :icon="['fas', 'download']" /> Download</nuxt-link>
              <div class="dropdown-item m-dropdown" @click="copyLink"><font-awesome-icon :icon="['fas', 'link']" /> Copy Link</div>
              <div class="dropdown-item m-dropdown"><font-awesome-icon :icon="['fas', 'share']" /> Share</div>
              <div class="dropdown-item m-dropdown"><font-awesome-icon :icon="['far', 'flag']" /> Report</div>
            </div>
          </div>
        </td>
      </tr>
    </table>
    <vue-context ref="menu">
      <li>
        <a :href="'/m/'+meme.uuid" target="_blank">
          <font-awesome-icon :icon="['fas', 'external-link-alt']" />&ensp;Open in new tab
        </a>
      </li>
      <li>
        <a href="javascript:void(0);" @click="copyLink">
          <font-awesome-icon :icon="['fas', 'link']" />&ensp;Copy link
        </a>
      </li>
      <li>
        <a :href="'img?m='+meme.uuid" target="_blank">
          <font-awesome-icon :icon="['fas', 'download']" />&ensp;Download
        </a>
      </li>
      <li v-if="$auth.loggedIn">
        <a href="javascript:void(0);">
          <font-awesome-icon :icon="['fas', 'flag']" />&ensp;Report
        </a>
      </li>
    </vue-context>
  </div>
</template>

<script>
import voteMixin from '~/mixins/voteMixin'
import copy from 'copy-to-clipboard'
import VueContext from 'vue-context'

export default {
  name: 'Meme',
  components: {
    VueContext
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
  mixins: [voteMixin],
  data() {
    return {
      isLiked: false,
      isDisliked: false,
      isVideo: this.meme.content_type.startsWith('video/') || this.meme.content_type === "image/gif",
      isGif: this.meme.content_type === "image/gif",
      paused: true
    }
  },
  mounted() {
    this.$emit("new-meme-event", this.$refs.memeEl, this.isVideo)
  },
  methods: {
    vidClick() {this.paused ? this.togglePlayback() : window.open(`/m/${this.meme.uuid}`)},
    togglePlayback(play=true) {
        this.paused = !play
        play ? this.$refs.memeEl.play() : this.$refs.memeEl.pause()
    },
    rmCBodyHeight() {this.$refs.cbody.style.height = null},
    copyLink() {copy(`${window.location.origin}/m/${this.meme.uuid}`)},
    vote(v) {this.sendVote(this.meme, v, "m")},
    restartVid() {this.$refs.memeEl.currentTime = 0},
    async openContextMenu(e) {
      // Close all other context menus first
      await this.$emit("context-menu-event")
      console.log(e)
      this.$refs.menu.open(e)
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
@media (max-width: 575.98px) {
  .item {
    border-left: none;
    border-right: none;
    border-radius: 0;
  }
  .content {
    object-fit: unset;
  }
}
.item-header {
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
}
.header-username {
  font-size: 14px;
  color: darkgray;
}
.header-page {
  font-size: 13px;
  color: grey;
}
.caption {
  font-weight: 450;
  overflow-wrap: break-word;
}
.item-body {
  max-height: 30rem;
  /* max-height: 80vh; */
  position: relative;
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
</style>