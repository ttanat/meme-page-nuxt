<template>
  <div :class="{'mb-2': isDeleted}" class="container-fluid">
    <div class="row">

      <div class="reply-left-column">
        <!-- Replier image or icon -->
        <font-awesome-icon v-if="isDeleted||!reply.username" :icon="['fas', 'user-circle']" class="mt-2" style="color: grey;" />
        <nuxt-link v-else :to="'/u/'+reply.username" no-prefetch>
          <img v-if="reply.dp_url" class="rounded-circle" :src="reply.dp_url" height="25" width="25">
          <font-awesome-icon v-else :icon="['fas', 'user-circle']" style="color: lightgrey;" />
        </nuxt-link>
      </div>

      <div class="reply-right-column" :style="{paddingTop: reply.dp_url ? '3px' : ''}">

        <div>
          <!-- Username and date -->
          <span>
            <span v-if="isDeleted||!reply.username" class="comment-username">[REDACTED]</span>
            <nuxt-link v-else :to="'/u/'+reply.username" class="comment-username" no-prefetch>{{ reply.username }}</nuxt-link>&nbsp;
            <span v-if="reply.username===memeUsername" class="op-reply" title="Original Poster">
              <font-awesome-icon :icon="['fas', 'user-alt']" />&nbsp;
            </span>
            <span class="comment-date">{{ formatDate(reply.post_date) }}{{ reply.edited ? " (edited)" : "" }}</span>
          </span>

          <!-- Dropdown buttons for editing/deleting/reporting -->
          <div v-if="isAuthenticated && !isDeleted" class="dropdown comment-dropdown-btn float-right">
            <span data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <font-awesome-icon :icon="['fas', 'angle-down']" />
            </span>
            <div class="dropdown-menu dropdown-menu-right c-dropdown-menu">
              <template v-if="isOwnReply">
                <div v-if="editing" @click="editReply" class="dropdown-item">
                  <font-awesome-icon :icon="['fas', 'save']" />&ensp;Save
                </div>
                <div class="dropdown-item" ref="toggleEditButton" @click="toggleEdit">
                  <font-awesome-icon :icon="['fas', editing ? 'times' : 'pen']" />&ensp;{{ editing ? "Cancel" : "Edit"}}
                </div>
              </template>
              <!-- Report button -->
              <div v-if="!canDelete && !isModCanRemove" class="dropdown-item" @click="report"><font-awesome-icon :icon="['fas', 'flag']" />&ensp;Report</div>
              <!-- Delete/remove button for meme OP, comment OP, or mod -->
              <div v-if="canDelete || isModCanRemove" class="dropdown-item" @click="confirmDelete">
                <font-awesome-icon :icon="['fas', 'trash-alt']" />&ensp;{{ isOwnReply ? "Delete" : "Remove" }}
              </div>
            </div>
          </div>
        </div>

        <!-- Reply content -->
        <span v-if="isDeleted" class="comment-deleted">Comment has been REDACTED</span>
        <span v-else v-show="!editing" :class="{'d-block': !editing}" class="comment-content reply-content">
          <span v-if="rpattern"><nuxt-link :to="'/u/'+rpattern[1]">{{ rpattern[0] }}</nuxt-link>{{ replyAfterMention }}</span>
          <template v-else>{{ reply.content }}</template>
        </span>

        <!-- Input for editing reply -->
        <input v-model="editReplyValue" v-if="editing && isOwnReply && !isDeleted && isAuthenticated" ref="editReplyInput" class="edit-comment-field" maxlength="150">

        <!-- Reply image -->
        <nuxt-link v-if="reply.image" :to="'/img?c='+reply.uuid" target="_blank">
          <img ref="replyImg" class="mt-1 reply-image fade-in" :data-src="reply.image">
        </nuxt-link>

        <!-- Like/dislike/reply buttons under reply -->
        <div v-if="!isDeleted && reply.username" class="container-fluid">
          <div class="row comment-buttons">
            <button @click="vote('l')" :class="{green: isLiked}" class="btn btn-sm c-thumbs like"><font-awesome-icon :icon="[isLiked ? 'fas' : 'far', 'thumbs-up']" /></button>
            <button class="btn btn-sm comment-points text-muted" style="cursor: text;">{{ displayPoints }}</button>
            <button @click="vote('d')" :class="{red: isDisliked}" class="btn btn-sm c-thumbs dislike ml-2"><font-awesome-icon :icon="[isDisliked ? 'fas' : 'far', 'thumbs-down']" /></button>
            <button @click="typeReply" class="btn btn-sm text-muted reply-button">{{ typingReply ? "Close" : "Reply" }}</button>
          </div>
        </div>

        <div v-if="typingReply && !isDeleted && reply.username && isAuthenticated" class="container-fluid">
          <div class="row">
            <!-- Profile picture or user icon -->
            <img v-if="hasDP" :src="hasDP" class="reply-field-dp rounded-circle" height="23" width="23" style="padding: 0;">
            <font-awesome-icon v-else :icon="['fas', 'user-circle']" class="reply-field-dp" style="font-size: 23px;" />
            <!-- Input to write reply -->
            <input
              ref="replyInput"
              v-model.trim="replyInputValue"
              :placeholder="submittingReply ? 'Sending...' : 'Write a reply'"
              :class="{'mb-2': !imageFilename}"
              class="reply-field reply-reply-field"
              type="text"
              maxlength="150"
              name="reply"
            >
            <!-- Choose image and submit button -->
            <a href="javascript:void(0);" @click="$refs.imageInput.click()" class="rf-img"><font-awesome-icon :icon="['far', 'image']" /></a>
            <button @click="submitReply" :disabled="submittingReply" :class="{'not-allowed': submittingReply}" class="btn btn-primary post-reply-btn" style="height: 27px;">Post</button>
            <!-- File input -->
            <input v-show="false" ref="imageInput" @change="addReplyImage" type="file" accept="image/jpeg, image/png">
            <!-- Show filename if a file is selected -->
            <span v-if="imageFilename" class="mt-1 mb-2" style="margin-left: 33px;">
              {{ imageFilename }}<a @click="removeReplyImage" class="ml-2" href="javascript:void(0);" style="color: red;"><font-awesome-icon :icon="['fas', 'times']" /></a>
            </span>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import voteMixin from '~/mixins/voteMixin'
import formatDateMixin from '~/mixins/formatDateMixin'
import checkAuthMixin from '~/mixins/checkAuthMixin'
import formatNumberMixin from '~/mixins/formatNumberMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'ReplyItem',
  mixins: [formatDateMixin, formatNumberMixin, voteMixin, checkAuthMixin],
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
      isLiked: this.reply.vote === 1,
      isDisliked: this.reply.vote === -1,
      editing: false,
      hidePoints: this.reply.points === null,
      typingReply: false,
      replyInputValue: "",
      submittingReply: false,
      imageFilename: "",
      editReplyValue: this.reply.content,
    }
  },
  computed: {
    isAuthenticated() {
      return this.$auth.loggedIn
    },
    isOwnReply() {
      return this.isAuthenticated && this.reply.username === this.$auth.user.username
    },
    hasDP() {
      return this.isAuthenticated && this.$auth.user ? this.$auth.user.image : false
    },
    rpattern() {
      return this.reply.content.match(/^@([a-z0-9_]+) /i)
    },
    replyAfterMention() {
      return this.reply.content.slice(this.reply.content.indexOf(" "))
    },
    displayPoints() {
      return this.reply.points && !this.hidePoints ? this.formatNumber(this.reply.points) : ""
    },
    isDeleted() {
      return !this.reply.content && !this.reply.image
    },
    ...mapGetters({
      memeUsername: 'meme/username',
      memePageName: 'meme/pageName',
    }),
    isModCanRemove() {
      // Can remove reply if user is a moderator of the page that meme was posted to
      return this.isAuthenticated && this.$auth.user.moderating.find(p => p.name === this.memePageName)
    },
    isMemeOp() {
      // Check if user posted the meme
      return this.isAuthenticated && this.memeUsername === this.$auth.user.username
    },
    canDelete() {
      // Can delete reply if user posted the reply or meme
      return this.isOwnReply || this.isMemeOp
    }
  },
  methods: {
    toggleEdit() {
      this.editing = !this.editing
      if (this.editing) this.$nextTick(() => this.$refs.editReplyInput.focus())
    },
    report() {
      this.$store.commit("report/setNewReport", {
        reportObject: "reply",
        objectUid: this.reply.uuid
      })
    },
    confirmDelete() {
      if (this.canDelete) {
        /* Can delete meme if user posted meme or user posted reply */
        $("#deleteModal")[0].querySelector(".modal-body").querySelector("span").textContent = "reply"
        $("#deleteModal")[0].querySelector("#deleteModalBtn").onclick = () => {
          this.deleteReply()
          $("#deleteModal").modal('hide')
        }
        $("#deleteModal").modal('show')
      } else if (this.isModCanRemove) {
        /* Can delete reply if meme posted to page and user is mod of that page */
        if (confirm("Are you sure you want to remove this comment?")) this.deleteReplyMod()
      }
    },
    deleteReply() {
      const meme_uuid = this.isMemeOp && !this.isOwnReply ? `&mu=${this.$route.params.uuid}` : ""
      this.$axios.delete(`/api/comment/delete?u=${this.reply.uuid}${meme_uuid}`)
        .then(res => {
          if (res.status === 204) this.$emit("reply-deleted-event", this.reply.uuid)
        })
        .catch(console.log)
    },
    deleteReplyMod() {
      this.$axios.delete(`/api/mods/remove/comment/${this.reply.uuid}`)
        .then(() => this.$emit("reply-deleted-event", this.reply.uuid))
        .catch(err => err.response ? this.errorToast(err.response.data) : console.log(err))
    },
    editReply() {
      const uuid = this.reply.uuid
      const val = this.editReplyValue.slice(0, 150).trim()
      this.toggleEdit(uuid)
      if (this.isAuthenticated && val.length && val !== this.reply.content) {
        const data = new FormData()
        data.set("content", val)
        data.set("uuid", uuid)
        this.$axios.put("/api/comment/edit", data)
          .then(res => this.$emit("reply-edited-event", uuid, val))
          .catch(this.displayError)
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
      const data = new FormData()
      const content = this.replyInputValue.slice(0, 150).trim()
      if (content && content.length > 0 && content.match(/\S+/)) data.set("content", content)
      const img = this.imageInputValid() ? this.$refs.imageInput.files[0] : null
      if (img) data.set("image", img)

      if (data.has("content") || data.has("image")) {
        this.submittingReply = true
        const c_uuid = this.$parent.comment.uuid
        data.set("root_uuid", c_uuid)
        data.set("reply_to_uuid", this.reply.uuid)
        this.replyInputValue = ""

        this.$axios.post("/api/reply", data)
          .then(res => res.data)
          .then(({ uuid }) => {
            this.typingReply = false
            this.removeReplyImage()

            const new_reply = {
              uuid,
              c_uuid,
              username: this.$auth.user.username,
              dp_url: this.$auth.user.image,
              points: 0,
              post_date: new Date().toISOString(),
              content,
              image: data.has("image") && img ? URL.createObjectURL(img) : null
            }
            this.$emit("reply-event", new_reply)
          })
          .catch(err => {
            this.displayError(err)
            this.replyInputValue = content
          })
          .finally(() => this.submittingReply = false)
      }
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
.op-reply {
  font-size: 12px;
  color: #0077ff
}
</style>
