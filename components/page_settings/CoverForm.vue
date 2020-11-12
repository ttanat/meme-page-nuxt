<template>
  <!-- Uses the same data and methods as EditImage.vue -->
  <div>
    <img ref="oldImage" v-show="url && !inputHasImage" class="mb-3 w-100" :src="url">
    <img ref="newImage" v-show="inputHasImage" class="mb-3 w-100">
    <form>
      <label>Cover photo</label>
      <input ref="imgInput" @change="inputChange" class="d-block form-control form-control-sm" type="file" name="cover" accept="image/jpeg, image/png">
      <div class="mb-3">
        <small class="text-muted">
          Recommended: w >= ~1920, h = 150<br>
          Low width images will be stretched to fill screen
        </small>
      </div>
      <button ref="saveBtn" @click="submitImage" :class="{'not-allowed': !inputHasImage}" class="btn btn-sm btn-primary mr-3" type="button" disabled>Save</button>
      <button v-show="inputHasImage" @click="removeInputImage" class="btn btn-sm btn-secondary mr-3" type="button">Cancel</button>
      <button v-show="showDeleteBtn && url" @click="deleteImage" class="btn btn-sm btn-danger" type="button">Delete cover photo</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CoverForm',
  props: {
    pageCoverUrl: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      url: this.pageCoverUrl,
      inputHasImage: false,
      showDeleteBtn: !!this.pageCoverUrl
    }
  },
  methods: {
    checkInput() {
      const input = this.$refs.imgInput
      return input.files.length === 1 && ["image/jpeg", "image/png"].includes(input.files[0].type)
    },
    inputChange() {
      this.inputHasImage = this.checkInput()
      this.showDeleteBtn = this.$refs.saveBtn.disabled = !this.inputHasImage
      if (this.inputHasImage) {
        this.$refs.newImage.src = URL.createObjectURL(this.$refs.imgInput.files[0])
      }
    },
    submitImage() {
      if (this.checkInput()) {
        this.$refs.saveBtn.disabled = true
        this.$toast.info("Changing cover photo...", {
          position: 'top-center',
          duration: 1500
        })
        const data = new FormData()
        data.set("cover", this.$refs.imgInput.files[0])
        this.$axios.post(`/api/page/${this.$route.params.name}/settings`, data)
          .then(() => {
            this.$refs.oldImage.onload = this.removeInputImage
            this.url = this.$refs.newImage.src
            this.$refs.newImage.src = null
            this.successToast("Page cover changed")
          })
          .catch(err => {
            this.displayError(err)
            this.$refs.saveBtn.disabled = false
          })
      }
    },
    removeInputImage() {
      this.$refs.imgInput.value = null
      URL.revokeObjectURL(this.$refs.newImage.src)
      this.inputChange()
    },
    deleteImage() {
      if (confirm("Are you sure you want to delete this page's cover photo?")) {
        this.$axios.delete(`/api/page/${this.$route.params.name}/settings?d=cover`)
          .then(res => {if (res.status === 204) this.url = ""})
          .catch(this.displayError)
      }
    }
  }
}
</script>
