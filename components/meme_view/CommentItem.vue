<template>
  <div class="comment">
    <div class="container-fluid">
      <div class="row">

        <div class="comment-left-column">
          <!-- Commenter image or icon -->
          <font-awesome-icon v-if="isDeleted||!comment.username" :icon="['fas', 'user-circle']" style="color: grey;" />
          <nuxt-link v-else :to="'/u/'+comment.username" no-prefetch>
            <img v-if="comment.dp_url" class="rounded-circle" :src="comment.dp_url" height="40" width="40">
            <font-awesome-icon v-else :icon="['fas', 'user-circle']" style="color: lightgrey;" />
          </nuxt-link>
        </div>

        <div class="comment-right-column" :style="{paddingTop: comment.dp_url ? '10px' : '5px'}">

          <div>
            <!-- Username and date -->
            <span>
              <span v-if="isDeleted||!comment.username" class="comment-username">[REDACTED]</span>
              <nuxt-link v-else :to="'/u/'+comment.username" class="comment-username" no-prefetch>{{ comment.username }}</nuxt-link>&nbsp;
              <span v-if="comment.username===memeUsername" class="op-comment" title="Original Poster">
                <font-awesome-icon :icon="['fas', 'user-alt']" />&nbsp;
              </span>
              <span class="comment-date">{{ formatDate(comment.post_date) }}{{ comment.edited && !isDeleted ? " (edited)" : "" }}</span>
            </span>

            <!-- Dropdown buttons for editing/deleting/reporting -->
            <div v-if="isAuthenticated && !isDeleted" class="dropdown comment-dropdown-btn float-right">
              <span data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <font-awesome-icon :icon="['fas', 'angle-down']" />
              </span>
              <div class="dropdown-menu dropdown-menu-right c-dropdown-menu">
                <template v-if="isOwnComment">
                  <div v-if="editing" @click="editComment" class="dropdown-item">
                    <font-awesome-icon :icon="['fas', 'save']" />&ensp;Save
                  </div>
                  <div class="dropdown-item" @click="toggleEdit" ref="toggleEditButton">
                    <font-awesome-icon :icon="['fas', editing ? 'times' : 'pen']" />&ensp;{{ editing ? "Cancel" : "Edit" }}
                  </div>
                </template>
                <!-- Report button -->
                <div v-if="!canDelete && !isModCanRemove" class="dropdown-item" @click="report"><font-awesome-icon :icon="['fas', 'flag']" />&ensp;Report</div>
                <!-- Delete/remove button for meme OP, comment OP, or mod -->
                <div v-if="canDelete || isModCanRemove" class="dropdown-item" @click="confirmDelete">
                  <font-awesome-icon :icon="['fas', 'trash-alt']" />&ensp;{{ isOwnComment ? "Delete" : "Remove" }}
                </div>
              </div>
            </div>
          </div>

          <!-- Comment content -->
          <span v-show="!editing" :class="{'d-block': !editing, 'comment-deleted': isDeleted}" class="comment-content mr-2">{{ isDeleted ? "Comment has been REDACTED" : comment.content }}</span>

          <!-- Input for editing comment -->
          <input v-model.trim="editCommentValue" v-if="!isDeleted" v-show="editing && isAuthenticated && isOwnComment" ref="editCommentInput" class="edit-comment-field" maxlength="150">

          <!-- Comment image -->
          <nuxt-link v-if="comment.image" :to="'/img?c='+comment.uuid" target="_blank" no-prefetch>
            <img ref="commentImg" class="mt-1 comment-image fade-in" :data-src="comment.image">
          </nuxt-link>

          <!-- Like/dislike/reply buttons under comment -->
          <div v-if="!isDeleted && comment.username" class="container-fluid">
            <div class="row comment-buttons">
              <button @click="vote('l')" :class="{green: isLiked}" class="btn btn-sm c-thumbs like mr-0"><font-awesome-icon :icon="[isLiked ? 'fas' : 'far', 'thumbs-up']" style="margin-left: 0;" /></button>
              <button class="btn btn-sm comment-points" style="cursor: text;">{{ displayPoints }}</button>
              <button @click="vote('d')" :class="{red: isDisliked}" class="btn btn-sm c-thumbs dislike ml-2"><font-awesome-icon :icon="[isDisliked ? 'fas' : 'far', 'thumbs-down']" /></button>
              <button @click="typeReply" class="btn btn-sm reply-button">{{ typingReply ? "Close" : "Reply" }}</button>
            </div>
          </div>

          <!-- If comment has replies -->
          <div v-if="comment.num_replies">
            <!-- Button to show replies -->
            <small @click="viewReplies" class="comment-small">
              {{ showingReplies ? "Hide" : "View" }} {{ comment.num_replies === 1 ? "reply" : formatNumber(comment.num_replies) + " replies" }} <font-awesome-icon :icon="['fas', showingReplies ? 'caret-up' : 'caret-down']" />
            </small>
            <br>
            <!-- Replies -->
            <div v-show="showingReplies">
              <ReplyItem
                v-for="reply in replies"
                :key="reply.uuid"
                :reply="reply"
                @reply-event="replyAdded"
                @new-reply-loaded-event="observeNewReply"
                @reply-edited-event="replyEdited"
                @reply-deleted-event="replyDeleted"
                @set-points-event="setPoints"
              />
            </div>
            <!-- Button to load more replies -->
            <div v-if="loadMoreBtnShowing && showingReplies"><small class="comment-small" @click="loadReplies">Load more <font-awesome-icon :icon="['fas', 'angle-right']" /></small></div>
            <div v-show="loadSpinnerShowing" style="font-size: 20px;"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
          </div>

          <div v-if="!isDeleted && comment.username && isAuthenticated" v-show="typingReply" class="container-fluid">
            <div class="row">
              <!-- Profile picture or user icon -->
              <img v-if="hasDP" :src="hasDP" class="reply-field-dp rounded-circle" height="25" width="25">
              <font-awesome-icon v-else :icon="['fas', 'user-circle']" class="reply-field-dp" style="font-size: 25px;" />
              <!-- Input to write comment -->
              <input
                ref="replyInput"
                v-model.trim="replyInputValue"
                :placeholder="submittingReply ? 'Sending...' : 'Write a reply'"
                class="reply-field"
                type="text"
                maxlength="150"
                name="reply"
              >
              <!-- Choose image and submit button -->
              <a href="javascript:void(0);" @click="$refs.imageInput.click()" class="rf-img"><font-awesome-icon :icon="['far', 'image']" /></a>
              <button @click="submitReply" :disabled="submittingReply" :class="{'not-allowed': submittingReply}" class="btn btn-primary post-reply-btn">Post</button>
              <!-- File input -->
              <input v-show="false" ref="imageInput" @change="addReplyImage" type="file" accept="image/jpeg, image/png">
              <!-- Show filename if a file is selected -->
              <span v-if="imageFilename" class="mt-1" style="margin-left: 35px;">
                {{ imageFilename }}<a @click="removeReplyImage" class="ml-2 red" href="javascript:void(0);"><font-awesome-icon :icon="['fas', 'times']" /></a>
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ReplyItem from './ReplyItem'
import voteMixin from '~/mixins/voteMixin'
import formatDateMixin from '~/mixins/formatDateMixin'
import checkAuthMixin from '~/mixins/checkAuthMixin'
import lazyLoadMixin from '~/mixins/lazyLoadMixin'
import formatNumberMixin from '~/mixins/formatNumberMixin'
import { mapGetters } from 'vuex'

export default {
  name: 'CommentItem',
  components: {
    ReplyItem
  },
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  mixins: [formatDateMixin, formatNumberMixin, voteMixin, checkAuthMixin, lazyLoadMixin],
  data() {
    return {
      replies: [],
      currentReplyUuids: new Set(),
      isLiked: this.comment.vote === 1,
      isDisliked: this.comment.vote === -1,
      editing: false,
      hidePoints: this.comment.points === null,
      showingReplies: false,
      loadMoreBtnShowing: false,
      loadSpinnerShowing: false,
      repliesAPILink: `/api/replies/?u=${this.comment.uuid}`,
      typingReply: false,
      replyInputValue: "",
      submittingReply: false,
      imageFilename: "",
      editCommentValue: this.comment.content
    }
  },
  mounted() {
    if (this.comment.image) this.$emit("new-comment-loaded-event", this.$refs.commentImg)
  },
  computed: {
    isAuthenticated() {
      return this.$auth.loggedIn
    },
    isOwnComment() {
      return this.isAuthenticated && this.comment.username === this.$auth.user.username
    },
    hasDP() {
      return this.isAuthenticated && this.$auth.user ? this.$auth.user.image : false
    },
    displayPoints() {
      return this.comment.points && !this.hidePoints ? this.formatNumber(this.comment.points) : ""
    },
    isDeleted() {
      return !this.comment.content && !this.comment.image
    },
    ...mapGetters({
      memeUsername: 'meme/username',
      memePageName: 'meme/pageName',
    }),
    isModCanRemove() {
      // Can remove comment if user is a moderator of the page that meme was posted to
      return this.isAuthenticated && this.$auth.user.moderating.find(p => p.name === this.memePageName)
    },
    isMemeOp() {
      // Check if user posted the meme
      return this.isAuthenticated && this.memeUsername === this.$auth.user.username
    },
    canDelete() {
      // Can delete comment if user posted the comment or meme
      return this.isOwnComment || this.isMemeOp
    }
  },
  methods: {
    observeNewReply(reply) {this.lazyObjectObserver.observe(reply)},
    toggleEdit() {
      this.editing = !this.editing
      if (this.editing) this.$nextTick(() => this.$refs.editCommentInput.focus())
    },
    report() {
      this.$store.commit("report/setNewReport", {
        reportObject: "comment",
        objectUid: this.comment.uuid
      })
    },
    confirmDelete() {
      if (this.canDelete) {
        /* Can delete meme if user posted meme or user posted comment */
        $("#deleteModal")[0].querySelector(".modal-body").querySelector("span").textContent = "comment"
        $("#deleteModal")[0].querySelector("#deleteModalBtn").onclick = () => {
          this.deleteComment()
          $("#deleteModal").modal('hide')
        }
        $("#deleteModal").modal('show')
      } else if (this.isModCanRemove) {
        /* Can delete comment if meme posted to page and user is mod of that page */
        if (confirm("Are you sure you want to remove this comment?")) this.deleteCommentMod()
      }
    },
    deleteComment() {
      const meme_uuid = this.isMemeOp && !this.isOwnComment ? `&mu=${this.$route.params.uuid}` : ""
      this.$axios.delete(`/api/comment/delete?u=${this.comment.uuid}${meme_uuid}`)
        .then(res => {
          if (res.status === 204) this.$emit("comment-deleted-event", this.comment.uuid)
        })
        .catch(console.log)
    },
    deleteCommentMod() {
      this.$axios.delete(`/api/mods/remove/comment/${this.comment.uuid}`)
        .then(() => this.$emit("comment-deleted-event", this.comment.uuid))
        .catch(err => err.response ? this.errorToast(err.response.data) : console.log(err))
    },
    editComment() {
      const uuid = this.comment.uuid
      const val = this.editCommentValue.slice(0, 150).trim()
      this.toggleEdit(uuid)
      if (!this.isAuthenticated || !val.length || val === this.comment.content) return false
      const data = new FormData()
      data.set("content", val)
      data.set("uuid", uuid)
      this.$axios.put("/api/comment/edit", data)
        .then(res => this.$emit("comment-edited-event", uuid, val))
        .catch(console.log)
    },
    vote(v) {this.sendVote(this.comment, v, "c", this.hidePoints)},
    setPoints(uuid, new_points_val) {
      this.replies.find(reply => reply.uuid === uuid).points = new_points_val
    },
    typeReply() {
      if (this.checkAuth()) {
        this.typingReply = !this.typingReply
        if (this.typingReply) this.$nextTick(() => this.$refs.replyInput.focus())
      }
    },
    viewReplies() {
      this.showingReplies = !this.showingReplies
      if (!this.replies.length && this.showingReplies) this.loadReplies()
    },
    loadReplies() {
      if (!this.repliesAPILink) return false
      this.loadSpinnerShowing = true
      this.$axios.get(this.repliesAPILink)
        .then(({ data: { results, next } }) => {
          const newReplies = []
          for (const r of results) {
            if (!this.currentReplyUuids.has(r.uuid)) {
              newReplies.push(r)
              this.currentReplyUuids.add(r.uuid)
            }
          }
          this.replies.push(...newReplies)
          this.loadMoreBtnShowing = !!next
          this.repliesAPILink = next
        })
        .catch(console.log)
        .finally(() => this.loadSpinnerShowing = false)
    },
    submitReply() {
      const data = new FormData()
      const content = this.replyInputValue.slice(0, 150).trim()
      if (content && content.length > 0 && content.match(/\S+/)) data.set("content", content)
      const img = this.imageInputValid() ? this.$refs.imageInput.files[0] : null
      if (img) data.set("image", img)
      if (this.isAuthenticated && (data.has("content") || data.has("image"))) {
        this.submittingReply = true
        data.set("root_uuid", this.comment.uuid)
        data.set("reply_to_uuid", this.comment.uuid)
        this.replyInputValue = ""

        this.$axios.post("/api/reply", data)
          .then(res => {
            this.typingReply = false
            this.removeReplyImage()

            const new_reply = {
              uuid: res.data.uuid,
              c_uuid: this.comment.uuid,
              username: this.$auth.user.username,
              dp_url: this.$auth.user.image,
              points: 0,
              post_date: new Date().toISOString(),
              content,
              image: data.has("image") && img ? URL.createObjectURL(img) : null
            }
            this.replyAdded(new_reply)
          })
          .catch(err => {
            /**/console.log(err)
            this.replyInputValue = content
          })
          .finally(() => this.submittingReply = false)
      }
    },
    replyAdded(data) {
      // Only add reply if it is the first or last reply
      if (!this.comment.num_replies || this.comment.num_replies === this.replies.length) this.replies.push(data)
      this.$emit("increment-num-replies-event", this.comment.uuid)
    },
    imageInputValid() {
      const input = this.$refs.imageInput
      return input.files.length === 1 && ["image/jpeg", "image/png"].includes(input.files[0].type)
    },
    addReplyImage() {
      this.imageInputValid() ? this.imageFilename = this.$refs.imageInput.files[0].name : this.removeReplyImage()
    },
    removeReplyImage() {
      this.imageFilename = ""
      this.$refs.imageInput.value = null
    },
    getReply(uuid) {
      return this.replies.find(r => r.uuid === uuid)
    },
    replyEdited(uuid, val) {
      const reply = this.getReply(uuid)
      reply.content = val
      reply.edited = true
    },
    replyDeleted(uuid) {
      const reply = this.getReply(uuid)
      reply.content = reply.image = null
    }
  }
}
</script>

<style scoped>
.op-comment {
  font-size: 12px;
  color: #0077ff
}
</style>
