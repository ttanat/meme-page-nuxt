<template>
  <div class="comment">
    <div class="container-fluid">
      <div class="row">

        <div class="comment-left-column">
          <a :href="'/user/'+comment.username">
            <img v-if="comment.dp_url" class="rounded-circle" :src="comment.dp_url" height="40" width="40">
            <font-awesome-icon v-else :icon="['fas', 'user-circle']" />
          </a>
        </div>

        <div class="comment-right-column" :style="{paddingTop: comment.dp_url ? '10px' : '5px'}">

          <div>
            <span><a :href="'/user/'+comment.username" class="comment-username">{{ comment.username }}</a>&ensp;<span class="comment-date">{{ formatDate(comment.post_date) }}{{ comment.edited ? " (edited)" : "" }}</span></span>
            <div v-if="isAuthenticated && !isDeleted" class="dropdown comment-down-btn float-right">
              <span data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <font-awesome-icon :icon="['fas', 'angle-down']" />
              </span>
              <div class="dropdown-menu dropdown-menu-right c-dropdown-menu">
                <template v-if="isOwnComment">
                  <div class="dropdown-item" @click="toggleEdit" ref="toggleEditButton">
                    <template v-if="editing"><font-awesome-icon :icon="['fas', 'times']" />&ensp;Cancel</template>
                    <template v-else><font-awesome-icon :icon="['fas', 'pen']" />&ensp;Edit</template>
                  </div>
                  <div class="dropdown-item" @click="confirmDelete">
                    <font-awesome-icon :icon="['fas', 'trash-alt']" />&ensp;Delete
                  </div>
                </template>
                <div v-else class="dropdown-item"><font-awesome-icon :icon="['fas', 'flag']" />&ensp;Report</div>
              </div>
            </div>
          </div>

          <span v-show="!editing" :class="{'d-block': !editing, 'comment-deleted': isDeleted}" class="comment-content mr-2">{{ isDeleted ? "Comment has been REDACTED" : comment.content }}</span>
          <input v-if="!isDeleted" v-show="editing && isAuthenticated && isOwnComment" ref="editCommentInput" @keyup.enter="editComment(comment.uuid)" class="edit-comment-field" :value="comment.content">
          <a v-if="comment.image" :href="'/img?c='+comment.uuid" target="_blank">
            <img ref="commentImg" class="mt-1 comment-image fade-in" :data-src="comment.image">
          </a>

          <div v-if="!isDeleted" class="container-fluid">
            <div class="row comment-buttons">
              <button @click="vote('l')" :class="{green: isLiked}" class="btn btn-sm c-thumbs like mr-0"><font-awesome-icon :icon="[isLiked ? 'fas' : 'far', 'thumbs-up']" style="margin-left: 0;" /></button>
              <button class="btn btn-sm comment-points" style="cursor: text;">{{ displayPoints }}</button>
              <button @click="vote('d')" :class="{red: isDisliked}" class="btn btn-sm c-thumbs dislike ml-2"><font-awesome-icon :icon="[isDisliked ? 'fas' : 'far', 'thumbs-down']" /></button>
              <button @click="typeReply" class="btn btn-sm reply-button">{{ typingReply ? "Close" : "Reply" }}</button>
            </div>
          </div>

          <div v-if="comment.num_replies">
            <small @click="viewReplies" class="comment-small">
              {{ showingReplies ? "Hide" : "View" }} {{ comment.num_replies === 1 ? "reply" : comment.num_replies + " replies" }} <font-awesome-icon :icon="['fas', showingReplies ? 'caret-up' : 'caret-down']" />
            </small>
            <br>
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
            <div v-if="loadMoreBtnShowing && showingReplies"><small class="comment-small" @click="loadReplies">Load more <font-awesome-icon :icon="['fas', 'angle-right']" /></small></div>
            <div v-show="loadSpinnerShowing" style="font-size: 20px;"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
          </div>

          <div v-if="!isDeleted" v-show="typingReply && isAuthenticated" class="container-fluid">
            <div class="row">
              <img v-if="hasDP" :src="hasDP" class="reply-field-dp rounded-circle" height="25" width="25"><font-awesome-icon v-else :icon="['fas', 'user-circle']" class="reply-field-dp" style="font-size: 25px;" />
              <input ref="replyInput" v-model.trim="replyInputValue" :placeholder="replyInputPlaceholder" class="reply-field" type="text" maxlength="150" name="reply">
              <a href="javascript:void(0);" @click="openImageInput" class="rf-img"><font-awesome-icon :icon="['far', 'image']" /></a><button @click="submitReply" class="btn btn-xs btn-primary r-post-btn">Post</button>
              <input ref="imageInput" @change="addReplyImage" type="file" accept="image/jpeg, image/png, image/gif" class="d-none">
              <span v-if="imageFilename" class="mt-1" style="margin-left: 35px;"><span>{{ imageFilename }}</span><a @click="removeReplyImage" class="ml-2" href="javascript:void(0);" style="color: red;"><font-awesome-icon :icon="['fas', 'times']" /></a></span>
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
import loadLikesMixin from '~/mixins/loadLikesMixin'
import lazyLoadMixin from '~/mixins/lazyLoadMixin'

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
  mixins: [formatDateMixin, voteMixin, checkAuthMixin, lazyLoadMixin, loadLikesMixin],
  data() {
    return {
      replies: [],
      cmnt: this.comment,
      isLiked: false,
      isDisliked: false,
      editing: false,
      hidePoints: this.comment.points === null,
      showingReplies: false,
      loadMoreBtnShowing: false,
      loadSpinnerShowing: false,
      repliesAPILink: `/api/replies/?u=${this.comment.uuid}`,
      typingReply: false,
      replyInputValue: "",
      replyInputPlaceholder: "Write a reply",
      imageFilename: "",
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
      return this.comment.points && !this.hidePoints ? this.comment.points : ""
    },
    isDeleted() {
      return !this.comment.content && !this.comment.image
    }
  },
  methods: {
    observeNewReply(reply) {this.lazyObjectObserver.observe(reply)},
    toggleEdit() {
      this.editing = !this.editing
      if (this.editing) this.$nextTick(() => this.$refs.editCommentInput.focus())
    },
    confirmDelete() {
      $("#deleteModal")[0].querySelector(".modal-body").querySelector("span").textContent = "comment"
      $("#deleteModal")[0].querySelector("#deleteModalBtn").onclick = () => {
        this.deleteComment()
        $("#deleteModal").modal('hide')
      }
      $("#deleteModal").modal('show')
    },
    deleteComment() {
      this.$axios.delete(`/comment/delete?u=${this.comment.uuid}`, {headers: {"X-CSRFToken": getCookie('csrftoken'), "X-Requested-With": "XMLHttpRequest"}})
        .then(res => {
          if (res.status === 204) this.$emit("comment-deleted-event", this.comment.uuid)
        })
        .catch(console.log)
    },
    editComment(uuid) {
      const val = this.$refs.editCommentInput.value.slice(0, 150).trim()
      this.toggleEdit(uuid)
      if (!this.isAuthenticated || !val.length || val === this.comment.content) return false
      const data = new FormData()
      data.set("c", val)
      data.set("u", uuid)
      this.$axios.post("/comment/edit", data, {headers: {"X-CSRFToken": getCookie('csrftoken'), "X-Requested-With": "XMLHttpRequest"}})
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
        .then(res => res.data)
        .then(response => {
          const l_uuids = []
          for (let r of response["results"]) {
            if (this.replies.findIndex(r2 => r2.uuid === r.uuid) === -1) {
              this.replies.push(r)
              if (r.points !== null) l_uuids.push(r.uuid)
            }
          }
          this.loadMoreBtnShowing = !!response["next"]
          this.repliesAPILink = response["next"]
          if (this.isAuthenticated && l_uuids.length) this.loadLikes(l_uuids, "r")
        })
        .catch(console.log)
        .finally(() => this.loadSpinnerShowing = false)
    },
    submitReply() {
      const r_input = this.$refs.replyInput
      const data = new FormData()
      const val = this.replyInputValue.slice(0, 150).trim()
      if (val && val.length > 0 && val.match(/\S+/)) data.set("r", val)
      const img = this.imageInputValid() ? this.$refs.imageInput.files[0] : null
      if (img) data.set("i", img)
      if (this.$store.state.auth && (data.has("r") || data.has("i"))) {
        data.set("c_uuid", this.comment.uuid)
        this.replyInputValue = ""
        this.replyInputPlaceholder = "Sending..."

        this.$axios.post("/reply", data)
          .then(res => res.data)
          .then(response => {
            this.typingReply = false
            this.removeReplyImage()
            this.replyAdded(Object.assign(response, {c_uuid: this.comment.uuid, post_date: new Date().toISOString(), content: val, image: data.has("i") ? URL.createObjectURL(img) : null}, NR))
          })
          .catch(err => {
            /**/console.log(err)
            this.replyInputValue = val
          })
          .finally(() => this.replyInputPlaceholder = "Write a reply")
      }
    },
    replyAdded(data) {
      // Only add reply if it is the first or last reply
      if (!this.comment.num_replies || this.comment.num_replies === this.replies.length) this.replies.push(data)
      this.comment.num_replies++
      num_comments_span.textContent++
    },
    openImageInput() {
      this.$refs.imageInput.click()
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
      const i = this.replies.findIndex(r => r.uuid === uuid)
      return this.replies[i]
    },
    replyEdited(uuid, val) {
      const reply = this.getReply(uuid)
      reply.content = val
      reply.edited = true
    },
    replyDeleted(uuid) {
      const reply = this.getReply(uuid)
      // this.replies.splice(i, 1)
      // this.comment.num_replies--
      // num_comments_span.textContent--
      reply.content = reply.image = null
    }
  }
}
</script>

<style scoped>
@import '~/assets/comments.css';
</style>
