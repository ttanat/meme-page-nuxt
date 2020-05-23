<template>
  <div :class="{'mb-2': isDeleted}" class="container-fluid">
    <div class="row">

      <div class="reply-left-column">
        <a :href="'/user/'+reply.username">
          <img v-if="reply.dp_url" class="rounded-circle" :src="reply.dp_url" height="25" width="25">
          <font-awesome-icon v-else :icon="['fas', 'user-circle']" />
        </a>
      </div>

      <div class="reply-right-column" :style="{paddingTop: reply.dp_url ? '3px' : ''}">

        <span><a :href="'/user/'+reply.username" class="comment-username">{{ reply.username }}</a>&ensp;<span class="comment-date">{{ timesince }}{{ reply.edited ? " (edited)" : "" }}</span></span>

        <div v-if="isAuthenticated && !isDeleted" class="dropdown comment-down-btn float-right">
          <span data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <font-awesome-icon :icon="['fas', 'angle-down']" />
          </span>
          <div class="dropdown-menu dropdown-menu-right c-dropdown-menu">
            <template v-if="isAuthenticated && isOwnReply">
              <div class="dropdown-item" ref="toggleEditButton" @click="toggleEdit">
                <template v-if="editing"><font-awesome-icon :icon="['fas', 'times']" />&ensp;Cancel</template>
                <template v-else><font-awesome-icon :icon="['fas', 'pen']" />&ensp;Edit</template>
              </div>
              <div class="dropdown-item" @click="confirmDelete"><font-awesome-icon :icon="['fas', 'trash-alt']" />&ensp;Delete</div>
            </template>
            <div v-else class="dropdown-item"><font-awesome-icon :icon="['fas', 'flag']" />&ensp;Report</div>
          </div>
        </div>
        <br>

        <span v-if="isDeleted" class="comment-deleted">Comment has been REDACTED</span>
        <span v-else v-show="!editing" :class="{'d-block': !editing}" class="comment-content reply-content">
          <span v-if="rpattern"><a :href="'/user/'+rpattern[1]">{{ rpattern[0] }}</a>{{ replyAfterMention }}</span>
          <template v-else>{{ reply.content }}</template>
        </span>

        <input v-if="!isDeleted" v-show="editing && isAuthenticated && isOwnReply" ref="editReplyInput" @keyup.enter="editReply(reply.uuid)" class="edit-comment-field" :value="reply.content">
        <a v-if="reply.image" :href="'/img?c='+reply.uuid" target="_blank">
          <img ref="replyImg" class="mt-1 reply-image fade-in" :data-src="reply.image">
        </a>

        <div v-if="!isDeleted" class="container-fluid">
          <div class="row comment-buttons">
            <button @click="vote('l')" :class="{green: isLiked}" class="btn btn-sm c-thumbs like"><font-awesome-icon :icon="[isLiked ? 'fas' : 'far', 'thumbs-up']" /></button>
            <button class="btn btn-sm comment-points text-muted" style="cursor: text;">{{ displayPoints }}</button>
            <button @click="vote('d')" :class="{red: isDisliked}" class="btn btn-sm c-thumbs dislike ml-2"><font-awesome-icon :icon="[isDisliked ? 'fas' : 'far', 'thumbs-down']" /></button>
            <button @click="typeReply" class="btn btn-sm text-muted reply-button">{{ typingReply ? "Close" : "Reply" }}</button>
          </div>
        </div>

        <div v-if="!isDeleted" v-show="typingReply && isAuthenticated" class="container-fluid">
          <div class="row">
            <img v-if="hasDP" :src="hasDP" class="reply-field-dp rounded-circle" height="23" width="23" style="padding: 0;"><font-awesome-icon v-else :icon="['fas', 'user-circle']" class="reply-field-dp" style="font-size: 23px;" />
            <input ref="replyInput" v-model.trim="replyInputValue" :placeholder="replyInputPlaceholder" :class="{'mb-2': !imageFilename}" class="reply-field reply-reply-field" type="text" maxlength="150" name="reply">
            <a href="javascript:void(0);" @click="openImageInput" class="rf-img"><font-awesome-icon :icon="['far', 'image']" /></a><button @click="submitReply" class="btn btn-xs btn-primary r-post-btn" style="height: 27px;">Post</button>
            <input ref="imageInput" @change="addReplyImage" type="file" accept="image/jpeg, image/png, image/gif" class="d-none">
            <span v-if="imageFilename" class="mt-1 mb-2" style="margin-left: 33px;"><span>{{ imageFilename }}</span><a @click="removeReplyImage" class="ml-2" href="javascript:void(0);" style="color: red;"><font-awesome-icon :icon="['fas', 'times']" /></a></span>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import voteMixin from '~/mixins/voteMixin'
import formatDate from '~/assets/formatDate'
import checkAuthMixin from '~/mixins/checkAuthMixin'

export default {
  name: 'ReplyItem',
  mixins: [voteMixin, checkAuthMixin],
  props: {
    reply: {
      type: Object,
      required: true
    }
  },
  mounted() {
    if (this.reply.image) this.$emit("new-reply-loaded-event", this.$refs.replyImg)
  },
  data() {
    return {
      isLiked: false,
      isDisliked: false,
      editing: false,
      hidePoints: this.reply.points === null,
      typingReply: false,
      replyInputValue: "",
      replyInputPlaceholder: "Write a reply",
      imageFilename: ""
    }
  },
  computed: {
    isAuthenticated() {
      return this.$auth.loggedIn
    },
    isOwnReply() {
      return this.reply.username === this.$auth.user.username
    },
    hasDP() {
      return this.isAuthenticated && this.$auth.user ? this.$auth.user.image : false
    },
    timesince() {
      return formatDate(this.reply.post_date)
    },
    rpattern() {
      if (!this.reply.content) return null // Delete this line later
      return this.reply.content.match(/^@([a-z0-9_]+) /i)
    },
    replyAfterMention() {
      return this.reply.content.slice(this.reply.content.indexOf(" "))
    },
    displayPoints() {
      return this.reply.points && !this.hidePoints ? this.reply.points : ""
    },
    isDeleted() {
      return !this.reply.content && !this.reply.image
    }
  },
  methods: {
    toggleEdit() {
      this.editing = !this.editing
      if (this.editing) this.$nextTick(() => this.$refs.editReplyInput.focus())
    },
    confirmDelete() {
      $("#deleteModal")[0].querySelector(".modal-body").querySelector("span").textContent = "reply"
      $("#deleteModal")[0].querySelector("#deleteModalBtn").onclick = () => {
        this.deleteReply()
        $("#deleteModal").modal('hide')
      }
      $("#deleteModal").modal('show')
    },
    deleteReply() {
      axios.delete(`/comment/delete?u=${this.reply.uuid}`, {headers: {"X-CSRFToken": getCookie('csrftoken'), "X-Requested-With": "XMLHttpRequest"}})
        .then(res => {
          if (res.status === 204) this.$emit("reply-deleted-event", this.reply.uuid)
        })
        .catch(err => display_error(err))
    },
    editReply(uuid) {
      const val = event.target.value.slice(0, 150).trim()
      this.toggleEdit(uuid)
      if (this.isAuthenticated && val.length && val !== this.reply.content) {
        const data = new FormData()
        data.set("c", val)
        data.set("u", uuid)
        this.$axios.post("/comment/edit", data)
          .then(res => this.$emit("reply-edited-event", uuid, val))
          .catch(err => display_error(err))
      }
    },
    vote(v) {this.sendVote(this.reply, v, "c", this.hidePoints)},
    typeReply() {
      if (this.checkAuth()) {
        this.typingReply = !this.typingReply
        if (this.typingReply) {
          if (!this.replyInputValue) this.replyInputValue = `@${this.reply.username} `
          this.$nextTick(() => this.$refs.replyInput.focus())
        }
      }
    },
    submitReply() {
      if (!this.replyInputValue || !this.isAuthenticated) return false
      const r_input = this.$refs.replyInput
      const data = new FormData()
      const val = this.replyInputValue.slice(0, 150).trim()
      if (val && val.length > 0 && val.match(/\S+/)) data.set("r", val)
      const img = this.imageInputValid() ? this.$refs.imageInput.files[0] : null
      if (img) data.set("i", img)

      if (data.has("r") || data.has("i")) {
        const c_uuid = this.$parent.comment.uuid
        data.set("c_uuid", c_uuid)
        this.replyInputValue = ""
        this.replyInputPlaceholder = "Sending..."

        this.$axios.post("/reply", data)
          .then(res => res.data)
          .then(response => {
            this.typingReply = false
            this.removeReplyImage()
            this.$emit("reply-event", Object.assign(response, {c_uuid, post_date: new Date().toISOString(), content: val, image: data.has("i") ? URL.createObjectURL(img) : null}, NR))
          })
          .catch(err => {
            display_error(err)
            this.replyInputValue = val
          })
          .finally(() => this.replyInputPlaceholder = "Write a reply")
      }
    },
    openImageInput() {
      this.$refs.imageInput.click()
    },
    imageInputValid() {
      const input = this.$refs.imageInput
      return input.files.length === 1 && comment_img_types.includes(input.files[0].type)
    },
    addReplyImage() {
      this.imageInputValid() ? this.imageFilename = this.$refs.imageInput.files[0].name : this.removeReplyImage()
    },
    removeReplyImage() {
      this.imageFilename = ""
      this.$refs.imageInput.value = null
    }
  }
}
</script>

<style scoped>
@import '~/assets/comments.css';
</style>
