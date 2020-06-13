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
                  <h5 ref="captionPreview" class="caption-preview" :style="{width: captionPreviewWidth + 'px'}">{{ caption }}</h5>
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
                      <template v-if="$auth.loggedIn">
                        <option v-for="m in $auth.user.moderating" :key="m.name" :value="m.name">{{ m.dname || m.name }}</option>
                        <template v-for="s in $auth.user.subscriptions">
                          <option v-if="s.permissions" :key="s.name" :value="s.name">{{ s.dname || s.name }}</option>
                        </template>
                      </template>
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
                <label>Caption</label>
                <br>
                <input v-model.trim="caption" @keyup="adjustCaptionPreviewWidth" type="text" class="input-form" maxlength="100" placeholder="Caption" autocomplete="off" style="outline: none;">
                <br>
                <small>{{ 100 - caption.length }} characters left</small>
                <div v-show="caption && canSubmit" class="custom-control custom-checkbox custom-checkbox-sm mt-2 mb-3">
                  <input v-model="embedCaption" :disabled="embedCaptionDisabled" type="checkbox" id="embedCaptionInput" class="custom-control-input custom-control-input-sm" autocomplete="off">
                  <label for="embedCaptionInput" class="custom-control-label" style="font-size: 15px;">
                    Embed caption <font-awesome-icon class="text-muted" style="font-size: 13px;" :icon="['far', 'question-circle']" data-toggle="tooltip" title="Image will be captured from the preview shown and may look worse on smaller screens. Available only for JPG and PNG images." />
                    <small v-if="embedCaption" style="color: grey;"><br>If prompted, please allow this site to extract canvas data.</small>
                  </label>
                </div>
                <div :class="{'mt-3': !(caption && canSubmit)}" class="custom-file mb-3">
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
          <button ref="submitButton" @click="upload" :disabled="!canSubmit" :class="{'not-allowed': !canSubmit}" type="button" class="btn btn-primary modal-btn" title="Upload">
            <template v-if="uploading">Uploading <font-awesome-icon :icon="['fas', 'circle-notch']" spin /></template>
            <template v-else>Upload</template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import htmlToImage from 'html-to-image'
import axios from 'axios' // For converting generated image to blob
// import { saveAs } from 'file-saver'

export default {
  name: 'UploadModal',
  data() {
    return {
      fname: "Choose File",
      page: "",
      category: "",
      caption: "",
      embedCaption: false,
      nsfw: false,
      tags: "",
      videoDuration: 99,
      canSubmit: false,
      uploading: false,
      showImgPreview: false,
      showVidPreview: false,
      captionPreviewWidth: 0,
      embedCaptionDisabled: true
    }
  },
  computed: {
    displayTags() {
      const tags = this.tags.match(/#[a-zA-Z]\w*/g)
      return tags ? tags.slice(0, 20).join(" ") : ""
    },
    pathname() {
      return this.$route.path
    },
    showClearButton() {
      return this.page || this.category || this.caption || this.nsfw || this.tags || this.canSubmit
    }
  },
  methods: {
    validateForm() {
      const uf = this.$refs.inputFile
      this.canSubmit = uf.files.length === 1 && ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"].includes(uf.files[0].type)
      uf.files[0].type.startsWith("video/") ? this.setVidDuration(uf.files[0]) : this.videoDuration = 99
      this.fname = this.canSubmit ? uf.files[0].name : "Choose File"
      this.canSubmit ? this.createPreview() : uf.value = null

      this.embedCaptionDisabled = !(uf && uf.files.length === 1 && ['image/jpeg', 'image/png'].includes(uf.files[0].type))
      if (this.embedCaptionDisabled) this.embedCaption = false
    },
    createPreview() {
      // Revoke existing preview URLs
      URL.revokeObjectURL(...[this.$refs.imgPreview.src, this.$refs.vidPreview.src])
      const file = this.$refs.inputFile.files[0]
      // Get image or video element
      const el = file.type.startsWith("image/") ? this.$refs.imgPreview : this.$refs.vidPreview
      this.showImgPreview = file.type.startsWith("image/")
      this.showVidPreview = !this.showImgPreview
      el.onload = () => {
        // Adjust caption width on preview once image is loaded
        this.captionPreviewWidth = this.showImgPreview ? this.$refs.imgPreview.offsetWidth : this.$refs.vidPreview.offsetWidth
      }
      // Create preview URL and show preview
      el.src = URL.createObjectURL(file)
    },
    async getCaptionedImage() {
      /*
        Returns promise with blob data for image file
      */
      this.caption = this.caption.slice(0, 100)
      const canvas = this.$refs.fullPreview
      const dataUrl = await htmlToImage.toJpeg(canvas, {backgroundColor: '#252525', quality: 0.92})
      const { data } = await axios.get(dataUrl, {responseType: 'blob'})
      return data
    },
    adjustCaptionPreviewWidth() {
      this.captionPreviewWidth = this.showImgPreview ? this.$refs.imgPreview.offsetWidth : this.showVidPreview ? this.$refs.vidPreview.offsetWidth : 0
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
    checkEmbedCaption() {
      const uf = this.$refs.inputFile
      const canEmbed = uf && uf.files.length === 1 && ['image/jpeg', 'image/png'].includes(uf.files[0].type)
      if (!canEmbed) this.embedCaption = false
      return canEmbed
    },
    check() {
      const input = this.$refs.inputFile
      const file = input.files[0]
      const type = file.type
      const lfname = file.name.toLowerCase()
      type.startsWith("video/") ? this.setVidDuration(file) : this.videoDuration = 99
      if (!file || !input.files.length) {
        this.errorToast("Please select a file.", duration=3000)
      } else if (input.files.length > 1) {
        this.errorToast("Cannot upload multiple files together.", duration=3000)
      } else if (!["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"].includes(type)
                 || (type === "image/jpeg" && (!lfname.endsWith(".jpg") && !lfname.endsWith(".jpeg")))
                 || (type === "video/quicktime" && !lfname.endsWith(".mov"))) {
        this.errorToast("Supported media types: JPG, PNG, GIF, MP4, MOV", duration=4000)
      } else if (type === "image/gif" && file.size > 5242880) {
        this.errorToast("Maximum file size for GIF is 5 MB", duration=3000)
      } else if (type.startsWith("image/") && file.size > 3145728) {
        this.errorToast("Maximum file size for images is 3 MB", duration=3000)
      } else if (type.startsWith("video/") && this.videoDuration > 60) {
        this.errorToast("Maximum video duration is 60 seconds", duration=3000)
      } else if (type.startsWith("video/") && this.videoDuration < 3) {
        this.errorToast("Minimum video duration is 3 seconds", duration=3000)
      } else if (type.startsWith("video/") && file.size > 15728640) {
        this.errorToast("Maximum file size for videos is 15 MB", duration=3000)
      } else {
        return true
      }
      return false
    },
    async setData() {
      /*
        Returns promise with FormData object
      */
      const data = new FormData()
      if (this.page) data.set("page", this.page)
      if (this.category) data.set("category", this.category)
      if (this.caption) data.set("caption", this.caption.trim().slice(0, 100))
      if (!data.get("caption") && !confirm("Are you sure you want to upload without a caption?")) return false
      // Check that caption can be embedded then set in data
      data.set("embed_caption", this.checkEmbedCaption() && this.embedCaption)
      // Find all tags in text area
      const tags = this.tags.match(/#[a-zA-Z]\w*/g)
      // Join all tags into one string (will be processed in backend instead)
      data.set("tags", tags ? tags.slice(0, 20).join("") : "")
      data.set("nsfw", this.nsfw)
      if (this.pathname === "/profile") data.set("is_profile_page", true)
      // Add file to data
      if (JSON.parse(data.get("embed_caption"))) {
        // Generate captioned image if "Embed caption" is selected
        data.set("file", await this.getCaptionedImage(), "m.jpeg") // Filename will be changed in server anyway
      } else {
        // Otherwise, use file from input
        data.set("file", this.$refs.inputFile.files[0])
      }
      return data
    },
    upload() {
      if (!this.$auth.loggedIn || !this.check() || !this.canSubmit) return false
      this.setData().then(formData => {
        if (!formData || !formData.has("file")) return false
        this.canSubmit = false
        this.$refs.submitButton.style.cursor = "progress"
        this.uploading = true
        this.$axios.post("/api/upload", formData)
          .then(({ data }) => {
            if (data.success) {
              if (data.uuid && this.$route.path === "/profile") {
                this.$root.$emit("newMemeUploaded", {
                  uuid: data.uuid,
                  url: URL.createObjectURL(formData.get("file")),
                  points: 0,
                  content_type: formData.get("file").type
                })
              }
              $("#uploadModal").modal("hide")
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
            this.uploading = false
            this.$refs.submitButton.style.cursor = null
          })
      })
    },
    clearForm() {
      this.page = this.category = this.caption = this.tags = ""
      this.nsfw = this.embedCaption = this.showImgPreview = this.showVidPreview = false
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
.caption-preview {
  font-weight: 400;
  padding: 8px 10px 0 10px;
  overflow-wrap: break-word;
}
.preview {
  max-width: 100%;
}
</style>
