<template>
  <div class="modal fade" id="uploadModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-light">
        <div class="modal-header">
          <h5 class="modal-title">Upload Meme</h5>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <div class="col-sm-6">
              <label>Upload to</label>
              <select v-model="page" class="custom-select custom-select-sm mr-sm-2">
                <option value="" selected>Your memes</option>
              </select>
            </div>
            <div class="col-sm-6">
              <label>
                Category <span class="text-muted" style="font-size: 12px;"><i class="far fa-question-circle" data-toggle="tooltip" title="Let your meme be discovered in more places!"></i></span>
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
                <option value="celebrities">Celebrities</option>
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
          <input v-model.trim="caption" type="text" class="input-form" maxlength="100" placeholder="Caption" autocomplete="off">
          <br>
          <small id="uploadCaptionSmall">{{ 100 - caption.length }} characters left</small>
          <div class="custom-file mt-3 mb-3">
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
            <div class="modal-footer">
          <button type="button" class="btn btn-secondary modal-btn" data-dismiss="modal" title="Cancel">Cancel</button>
          <button ref="submitButton" @click="upload" :class="{'not-allowed': !canSubmit}" type="button" class="btn btn-primary modal-btn" title="Upload" disabled>
            <template v-if="uploading">Uploading <font-awesome-icon :icon="['fas', 'circle-notch']" spin /></template><template v-else>Upload</template>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { mapMutations } from 'vuex'

export default {
  name: 'UploadModal',
  data() {
    return {
      fname: "Choose File",
      page: "",
      category: "",
      caption: "",
      nsfw: "",
      tags: "",
      videoDuration: 99,
      canSubmit: false,
      uploading: false
    }
  },
  computed: {
    displayTags() {
      const tags = this.tags.match(/#[a-zA-Z]\w*/g)
      return tags ? tags.slice(0, 20).join(" ") : ""
    }
  },
  methods: {
    validateForm() {
      const uf = this.$refs.inputFile;
      this.canSubmit = uf.files.length === 1 && ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/quicktime"].includes(uf.files[0].type);
      uf.files[0].type.startsWith("video/") ? this.setVidDuration(uf.files[0]) : this.videoDuration = 99;
      this.$refs.submitButton.disabled = !this.canSubmit;
      this.fname = this.canSubmit ? uf.files[0].name : "Choose File";
      if (!this.canSubmit) uf.value = null;
    },
    setVidDuration(file) {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => {
          URL.revokeObjectURL(v.src);
          this.videoDuration = v.duration;
      }
      v.src = URL.createObjectURL(file);
    },
    check() {
      const input = this.$refs.inputFile;
      const file = input.files[0];
      const type = file.type;
      const lfname = file.name.toLowerCase();
      type.startsWith("video/") ? this.setVidDuration(file) : this.videoDuration = 99;
      if (!file || !input.files.length) {
        alert("Please select a file.");
      } else if (input.files.length > 1) {
        alert("Cannot upload multiple files together.");
      } else if (!SFT.includes(type) || (type === "image/jpeg" && (!lfname.endsWith(".jpg") && !lfname.endsWith(".jpeg"))) || (type === "video/quicktime" && !lfname.endsWith(".mov"))) {
        alert("Supported media types: JPG, PNG, GIF, MP4, MOV");
      } else if (type === "image/gif" && file.size > 5242880) {
        alert("Maximum file size for GIF is 5 MB");
      } else if (type.startsWith("image/") && file.size > 3145728) {
        alert("Maximum file size for images is 3 MB");
      } else if (type.startsWith("video/") && this.videoDuration > 60) {
        alert("Maximum video duration is 60 seconds");
      } else if (type.startsWith("video/") && file.size > 15728640) {
        alert("Maximum file size for videos is 15 MB");
      } else {
        return true;
      }
      return false;
    },
    setData() {
      const d = new FormData();
      d.set("file", this.$refs.inputFile.files[0]);
      if (this.page) d.set("page", this.page);
      if (this.category) d.set("category", this.category);
      if (this.caption) d.set("caption", this.caption.trim().slice(0, 100));
      if (!d.get("caption") && !confirm("Are you sure you want to upload without a caption?")) return null;
      const tags = this.tags.match(/#[a-zA-Z]\w*/g);
      if (tags) {
        for (let i = 0, n = tags.slice(0, 20).length; i < n; i++) {
          d.append("tags", tags[i].slice(0, 64));
        }
      }
      d.set("nsfw", this.nsfw);
      return d;
    },
    upload() {
      if (!AUTH || !this.check()) return false;
      const data = this.setData();
      if (!data || !data.has("file")) return false;
      if (PN === "/profile") data.set("is_profile_page", true);
      if (PN.startsWith("/page/")) data.set("is_meme_page", true);
      this.$refs.submitButton.disabled = true;
      this.$refs.submitButton.style.cursor = "progress";
      this.uploading = true;
      axios.post("/upload", data, {headers: {"X-CSRFToken": getCookie('csrftoken'), "X-Requested-With": "XMLHttpRequest"}})
        .then(res => res.data)
        .then(response => {
          if (response["s"]) {
            display_success("Meme successfully uploaded.");
            $("#uploadModal").modal("hide");
            // Tell vue component that content_type is PNG so that GIF is displayed in IMG tag
            const tile_data = {uuid: response.uuid, url: URL.createObjectURL(data.get("file")), content_type: data.get("file").type === "image/gif" ? "image/png" : data.get("file").type};
            if (PN === "/profile" && TilesInstance) {
              TilesInstance.tiles.unshift(tile_data);
            } else if (MemesInstance) {
              const meme_data = Object.assign(tile_data, {username: USERNAME, caption: data.get("caption"), points: 0, num_comments: 0, dp_url: DP_URL});
              if (PN === `/page/${data.get("page")}`) {
                MemesInstance.mdata.unshift(Object.assign(meme_data, {pname: data.get("page"), pdname: PAGE_DNAME ? PAGE_DNAME : null}));
              } else if (PN === "/all") {
                MemesInstance.mdata.unshift(meme_data);
              }
            }
            this.page = this.category = this.caption = this.nsfw = this.tags = "";
            this.$refs.inputFile.value = null;
            this.fname = "Choose File";
          } else {
            alert(response["m"]);
          }
        })
        .catch(err => display_error(err))
        .finally(() => this.uploading = this.canSubmit = false);
    }
  }
}
</script>
