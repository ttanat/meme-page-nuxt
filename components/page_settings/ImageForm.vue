<template>
  <div>
    <img ref="oldImage" v-show="url && !inputHasImage" class="rounded-circle mb-3" :src="url" height="100" width="100">
    <img ref="newImage" v-show="inputHasImage" class="rounded-circle mb-3" height="100" width="100">
    <form>
      <label>Page image</label>
      <input ref="imgInput" @change="inputChange" class="d-block form-control form-control-sm mb-3" type="file" name="image" accept="image/jpeg, image/png">
      <button ref="saveBtn" @click="submitImage" :class="{'not-allowed': !inputHasImage}" class="btn btn-sm btn-primary mr-3" type="button" disabled>Save</button>
      <button v-show="inputHasImage" @click="removeInputImage" class="btn btn-sm btn-secondary mr-3" type="button">Cancel</button>
      <button v-show="showDeleteBtn && url" @click="deleteImage" class="btn btn-sm btn-danger" type="button">Delete image</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ImageForm',
  props: {
    pageImageUrl: {
      type: String,
      required: false,
      default: ""
    }
  },
  data() {
    return {
      url: this.pageImageUrl,
      inputHasImage: false,
      showDeleteBtn: !!this.pageImageUrl
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
        this.$toast.info("Changing image...", {
          position: 'top-center',
          duration: 1500
        })
        const data = new FormData()
        data.set("image", this.$refs.imgInput.files[0])
        this.$axios.post(`/api/page/${this.$route.params.name}/settings`, data)
          .then(() => {
            this.$refs.oldImage.onload = this.removeInputImage
            this.url = this.$refs.newImage.src
            this.$refs.newImage.src = null
            this.successToast("Page image changed")
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
      if (confirm("Are you sure you want to delete this page's image?")) {
        this.$axios.delete(`/api/page/${this.$route.params.name}/settings?d=image`)
          .then(res => {if (res.status === 204) this.url = ""})
          .catch(this.displayError)
      }
    }
  }
}
</script>
