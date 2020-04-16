<template>
  <div style="margin-bottom: 20px;">
    <textarea
      ref="textarea"
      v-model.trim="commentContent"
      @keydown.enter.prevent
      :placeholder="placeholder"
      class="form-control mb-2"
      maxlength="150"
      rows="2"
      id="comment-field"
    ></textarea>
    <button @click="post" class="btn btn-sm btn-primary mr-2">Post</button>
    <button @click="chooseFile" class="btn btn-sm btn-outline-secondary text-light mr-2"><font-awesome-icon :icon="['far', 'image']" style="font-size: 1rem;" /></button>
    <input ref="inputFile" v-show="false" @change="showFname" type="file" accept="image/jpeg, image/png, image/gif" autocomplete="off">
    <template v-if="fname"><span>{{ fname }}</span><a @click="removeFile" class="ml-2" href="javascript:void(0);" style="color: red;"><font-awesome-icon :icon="['fas', 'times']" /></a></template>
    <span class="text-muted float-right" style="font-size: 0.95rem;">{{ 150 - commentContent.length }} characters left</span>
    <div v-if="!numComments" id="no-comments">No comments yet</div>
  </div>
</template>

<script>
import checkAuthMixin from '~/mixins/checkAuthMixin'

export default {
  name: 'PostComment',
  props: {
    numComments: {
      type: Number,
      required: true
    }
  },
  mixins: [checkAuthMixin],
  data() {
    return {
      commentContent: "",
      placeholder: "Write a comment here!",
      fname: ""
    }
  },
  methods: {
    post() {
      const data = new FormData()
      data.set("u", UUID)
      if (this.fileValid()) data.set("i", this.$refs.inputFile.files[0])
      if (this.commentContent.length > 150) return false
      const val = this.commentContent.slice(0, 150).trim()
      if (val && val.length > 0 && val.match(/\S+/)) data.set("c", val)

      if (this.checkAuth() && (data.has("c") || data.has("i"))) {
        this.commentContent = ""
        this.placeholder = "Sending..."

        axios.post("/comment/post", data, {headers: {"X-CSRFToken": getCookie('csrftoken'), "X-Requested-With": "XMLHttpRequest"}})
          .then(res => res.data)
          .then(response => {
            this.removeFile()
            this.placeholder = "Sent"
            setTimeout(() => {this.placeholder = "Write a comment here!"}, 1000)
            CommentsInstance.cdata.unshift(Object.assign(response, NC, {post_date: new Date().toISOString(), content: val, image: data.has("i") ? URL.createObjectURL(data.get("i")) : null}))
            this.$emit("new-comment-event")
          })
          .catch(err => {
            display_error(err)
            this.commentContent = val
            this.placeholder = "Write a comment here!"
          })
      }
    },
    fileValid() {
      const input = this.$refs.inputFile
      if (input.files.length !== 1) return false
      if (!comment_img_types.includes(input.files[0].type)) {
        alert("Supported media types: JPG, PNG, GIF")
        return false
      } else if (input.files[0].size > 3145728) {
        alert("Maximum file size: 3 MB")
        return false
      } else {
        return true
      }
    },
    chooseFile() {
      if (this.checkAuth()) this.$refs.inputFile.click()
    },
    showFname() {
      if (this.fileValid()) this.fname = this.$refs.inputFile.files[0].name
    },
    removeFile() {
      this.fname = ""
      this.$refs.inputFile.value = null
    }
  }
}
</script>

<style scoped>
#comment-field {
  padding: 5px;
  margin-top: 15px;
  resize: none;
  background-color: whitesmoke;
}
#no-comments {
  text-align: center;
  padding: 40px;
  background-color: #090909;
  border-radius: 10px;
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>
