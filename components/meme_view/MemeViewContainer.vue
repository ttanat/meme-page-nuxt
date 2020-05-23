<template>
<div>
  <div class="container-fluid content-section" style="width: 98%;margin-bottom: 5px;">
    <div class="row">
      <div class="col-9" :style="{paddingTop: meme.caption ? '' : '18px'}">
        <h5 v-if="meme.caption" style="margin-top: .65rem;color: lightgrey;font-weight: 420;">{{ meme.caption }}</h5>
        <nuxt-link :to="'/user/' + meme.username" style="color: gainsboro;"><img v-if="meme.dp_url" class="rounded-circle" :src="meme.dp_url" height="24" width="24"><font-awesome-icon v-else :icon="['fas', 'user-circle']" style="font-size: 20px;" />&ensp;{{ meme.username }}</nuxt-link>
        <span v-if="meme.pname" class="text-muted" style="font-size: 14px;">&ensp;<font-awesome-icon :icon="['fas', 'caret-right']" />&ensp;<nuxt-link class="text-muted" :to="meme.pname">{{ meme.pdname || meme.pname }}</nuxt-link></span>
      </div>
      <div class="col-3 d-none d-lg-inline" id="rand-col" :style="{padding: meme.caption ? '20px' : '15px'}">
        <a class="btn btn-sm btn-success float-right" href="/random" target="_blank">Random <font-awesome-icon :icon="['far', 'arrow-alt-circle-right']" /></a>
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
  <video v-else-if="isGif" ref="vidMeme" @contextmenu.prevent class="content w-100" style="max-height: 85vh;" loop autoplay muted playsinline>
    <source :src="meme.url">
  </video>
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
        <div class="dropdown float-right" id="item-page-dropdown">
          <button class="btn lower-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
          </button>
          <div class="dropdown-menu bg-dark">
            <div class="dropdown-item m-dropdown"><nuxt-link :to="'/img?m='+meme.uuid" target="_blank"><font-awesome-icon :icon="['fas', 'download']" /> Download</nuxt-link></div>
            <div class="dropdown-item m-dropdown"><font-awesome-icon :icon="['fas', 'share']" /> Share</div>
            <div class="dropdown-item m-dropdown"><font-awesome-icon :icon="['far', 'flag']" /> Report</div>
          </div>
        </div>
      </td>
    </tr>
  </table>
  <span v-if="meme.tags.length" class="text-muted content-section">
    <button
      v-for="(tag_name, i) in meme.tags"
      :key="tag_name"
      @click="openLink(tag_name)"
      class="tag btn btn-sm btn-outline-primary mr-2"
      :class="{'ml-2': i === 0}"
    >
      {{ tag_name }}
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
  methods: {
    setPoints(uuid, new_points_val) {
      this.$emit("set-points-event", uuid, new_points_val)
    },
    copyLink() {
      copy(window.location.href)
      this.copyLinkClicked = true
      setTimeout(() => this.copyLinkClicked = false, 1500)
    },
    openLink(tag_name) {
      window.open(`/search?q=%23${tag_name.slice(1)}`)
    }
  }
}
</script>

<style scoped>
.tag {
  padding: 3px;
  font-size: 12px;
}
</style>
