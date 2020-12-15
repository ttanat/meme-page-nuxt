<template>
  <div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div :class="{'modal-xl': uploading || canSubmit}" class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-light">
        <div class="modal-header">
          <h5 class="modal-title">Upload Meme</h5>
        </div>
        <div class="modal-body">
          <div class="container-fluid px-0">
            <div class="row">
              <div v-show="uploading || canSubmit" class="col-6">
                <div ref="fullPreview">
                  <img v-show="showImgPreview" ref="imgPreview" class="preview w-100">
                  <video v-show="showVidPreview" ref="vidPreview" class="preview" controls></video>
                </div>
              </div>
              <div :class="[uploading || canSubmit ? 'col-6' : 'col-12']">
                <div class="form-row">
                  <div class="col-sm-6">
                    <label>Upload to</label>
                    <select v-model="page" class="custom-select custom-select-sm mr-sm-2">
                      <option value="" selected>Your memes</option>
                      <option v-for="p in uploadToOptions" :key="p.name" :value="p.name">{{ p.dname || p.name }}</option>
                    </select>
                  </div>
                  <div class="col-sm-6">
                    <label>
                      Category
                    </label>
                    <select v-model="category" class="custom-select custom-select-sm mr-sm-2">
                      <option value="">None</option>
                      <option value="movies">Movies</option>
                      <option value="tv-shows">TV Shows</option>
                      <option value="gaming">Gaming</option>
                      <option value="animals">Animals</option>
                      <option value="internet">Internet</option>
                      <option value="school">School</option>
                      <option value="anime">Anime</option>
                      <option value="people">People</option>
                      <option value="sports">Sports</option>
                      <option value="football">Football</option>
                      <option value="nba">NBA</option>
                      <option value="nfl">NFL</option>
                      <option value="news">News</option>
                      <option value="university">University</option>
                    </select>
                  </div>
                </div>
                <br>
                <textarea @keyup.enter="newLineCheck" v-model="caption" type="text" rows="2" class="input-form" maxlength="100" placeholder="Caption" autocomplete="off" style="outline: none;line-height: 1.8;"></textarea>
                <br>
                <small>{{ 100 - caption.length }} characters left</small>
                <div class="custom-file my-3">
                  <input ref="inputFile" @change="validateForm" type="file" class="custom-file-input" accept="image/jpeg, image/png, image/gif, video/mp4, video/quicktime" autocomplete="off" required>
                  <label class="custom-file-label">{{ fname }}</label>
                </div>
                <div class="custom-control custom-checkbox custom-checkbox-sm mb-3">
                  <input v-model="nsfw" type="checkbox" id="uploadNsfw" class="custom-control-input custom-control-input-sm" autocomplete="off">
                  <label for="uploadNsfw" class="custom-control-label" style="color: tomato;font-size: 15px;">NSFW</label>
                </div>
                <textarea v-model="tags" class="form-control" rows="2" placeholder="#tags (optional)" autocomplete="off" style="resize: none;padding: .15em;padding-left: 4px;"></textarea>
                <div style="color: royalblue;">{{ displayTags }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <a v-show="showClearButton" @click="clearForm" href="javascript:void(0);" class="mr-3" style="color: white;">Clear</a>
          <button type="button" class="btn btn-secondary modal-btn" data-dismiss="modal" title="Cancel">Cancel</button>
          <button
            ref="submitButton"
            @click="upload"
            :disabled="!canSubmit"
            :class="{'not-allowed': !canSubmit && !uploading}"
            :style="{'cursor': uploading ? 'progress' : ''}"
            type="button"
            class="btn btn-primary modal-btn"
            title="Upload"
          >
            <template v-if="uploading">Uploading <font-awesome-icon :icon="['fas', 'circle-notch']" spin /></template>
            <template v-else>Upload</template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadModal',
  data() {
    return {
      fname: "Choose File",
      page: "",
      category: "",
      caption: "",
      nsfw: false,
      tags: "",
      videoDuration: 99,
      canSubmit: false,
      showImgPreview: false,
      showVidPreview: false,
    }
  },
  computed: {
    uploading() {
      return this.$store.getters.uploadingMeme
    },
    uploadToOptions() {
      return [
        ...this.$auth.user.moderating,
        ...this.$auth.user.subscriptions.filter(s => 
          s.permissions && !this.$auth.user.moderating.find(m => m.name === s.name)
        )
      ]
    },
    displayTags() {
      const tags = this.tags.match(/#[a-zA-Z]\w*/g)
      return tags ? tags.slice(0, 20).join(" ") : ""
    },
    showClearButton() {
      return this.page || this.category || this.caption || this.nsfw || this.tags || this.canSubmit
    }
  },
  methods: {
    newLineCheck() {
      // Count number of "\n" found in caption and ensure no more than 4 used
      if ((this.caption.match(/\n/g) || []).length > 4) {
        let index = -1
        for (
          let i = 0, n = this.caption.length, newLinesFound = 0; // newLinesFound is number of "\n" in caption
          i < n, newLinesFound < 5; // If 5th "\n" found, i < n makes sure for loop ends
          i++, newLinesFound++
        ) {
          // Keep finding next index of "\n"
          index = this.caption.indexOf("\n", index + 1)
        }
        // Slice caption from start to 5th "\n" (but not including it)
        this.caption = this.caption.slice(0, index)
        alert("Maximum new lines reached")
      }
    },
    validateForm() {
      const uf = this.$refs.inputFile
      this.canSubmit = uf.files.length === 1 && ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"].includes(uf.files[0].type)
      uf.files[0].type.startsWith("video/") ? this.setVidDuration(uf.files[0]) : this.videoDuration = 99
      this.fname = this.canSubmit ? uf.files[0].name : "Choose File"
      this.canSubmit ? this.createPreview() : uf.value = null
    },
    createPreview() {
      // Revoke existing preview URLs
      URL.revokeObjectURL(...[this.$refs.imgPreview.src, this.$refs.vidPreview.src])
      const file = this.$refs.inputFile.files[0]
      // Get image or video element
      const el = file.type.startsWith("image/") ? this.$refs.imgPreview : this.$refs.vidPreview
      this.showImgPreview = file.type.startsWith("image/")
      this.showVidPreview = !this.showImgPreview
      // Create preview URL and show preview
      el.src = URL.createObjectURL(file)
    },
    setVidDuration(file) {
      const v = document.createElement("video")
      v.preload = "metadata"
      v.onloadedmetadata = () => {
          URL.revokeObjectURL(v.src)
          this.videoDuration = v.duration
      }
      v.src = URL.createObjectURL(file)
    },
    check() {
      const input = this.$refs.inputFile
      const file = input.files[0]
      const type = file.type
      const lfname = file.name.toLowerCase()
      type.startsWith("video/") ? this.setVidDuration(file) : this.videoDuration = 99
      if (!file || !input.files.length) {
        this.errorToast("Please select a file", duration=2000)
      } else if (input.files.length > 1) {
        this.errorToast("Cannot upload multiple files together", duration=2000)
      } else if (!["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"].includes(type)
                 || ![".jpg", ".jpeg", ".png", ".gif", ".mp4", ".mov"].find(ext => lfname.endsWith(ext))
                 || (type === "image/jpeg" && (!lfname.endsWith(".jpg") && !lfname.endsWith(".jpeg")))
                 || (type === "video/quicktime" && !lfname.endsWith(".mov"))) {
        alert("Supported media types: JPG, PNG, GIF, MP4, MOV")
      } else if (type.startsWith("image/") && file.size > 5242880) {
        alert("Maximum file size for images is 5 MB")
      } else if (type.startsWith("video/") && this.videoDuration > 60) {
        alert("Maximum video duration is 60 seconds")
      } else if (type.startsWith("video/") && this.videoDuration < 1) {
        alert("Minimum video duration is 1 second")
      } else if (type.startsWith("video/") && file.size > 15728640) {
        alert("Maximum video file size is 15 MB")
      } else {
        return true
      }
      return false
    },
    setData() {
      const data = new FormData()
      if (this.page) data.set("page", this.page)
      if (this.category) data.set("category", this.category)
      if (this.caption) data.set("caption", this.caption.trim().slice(0, 100))
      // Ensure caption only has maximum of 4 new lines
      if ((data.get("caption").match(/\n/g) || []).length > 4) {
        alert("Maximum new lines reached")
        return false
      }
      // Ensure there is a caption
      if (!data.get("caption")) {
        alert("Please write a caption")
        return false
      }
      // Find all tags in text area
      const tags = this.tags.match(/#[a-zA-Z]\w*/g)
      // Join all tags into one string (will be processed in backend instead)
      data.set("tags", tags ? tags.slice(0, 20).join("") : "")
      data.set("nsfw", this.nsfw)
      if (this.$route.path === "/profile") data.set("is_profile_page", true)
      // Add file to data
      data.set("file", this.$refs.inputFile.files[0])
      return data
    },
    upload() {
      if (!this.$auth.loggedIn || !this.check() || !this.canSubmit) return false
      // Set form data to send
      const formData = this.setData()
      if (!formData || !formData.has("file") || !formData.has("caption")) return false
      // Prevent user from submitting multiple times
      this.canSubmit = false
      // Set uploading in store to true
      this.$store.commit("setUploadingMeme", true)
      // Hide modal
      $("#uploadModal").modal("hide")
      // Tell user that meme is uploading
      this.$toast.info("Uploading meme...", {
        position: 'top-center',
        duration: 1500
      })
      // Start uploading
      this.$axios.post("/api/upload", formData)
        .then(({ data }) => {
          if (data.success) {
            if (data.uuid && this.$route.path === "/profile") {
              const file = formData.get("file")
              this.$root.$emit("newMemeUploaded", {
                uuid: data.uuid,
                url: URL.createObjectURL(file),
                videoUploaded: file.type.startsWith("video/"),
                points: 0,
                file_ext: file.name.slice(file.name.lastIndexOf(".")).toLowerCase()
              })
            }
            this.successToast("Meme successfully uploaded")
            this.clearForm()
          } else {
            this.canSubmit = true
            this.errorToast(data.message)
          }
        })
        .catch(err => {
          this.canSubmit = true
          this.displayError(err)
        })
        .finally(() => {
          this.$store.commit("setUploadingMeme", false)
        })
    },
    clearForm() {
      this.page = this.category = this.caption = this.tags = ""
      this.nsfw = this.showImgPreview = this.showVidPreview = false
      this.$refs.inputFile.value = null
      this.fname = "Choose File"
      this.canSubmit = false
      // Revoke preview URLs
      URL.revokeObjectURL(...[this.$refs.imgPreview.src, this.$refs.vidPreview.src])
    }
  }
}
</script>

<style scoped>
.preview {
  max-width: 100%;
}
</style>
