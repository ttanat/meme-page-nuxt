<template>
  <div class="form-group mb-5">
    <img ref="oldImage" v-show="url && !inputHasImage" :src="url" class="rounded-circle mb-3" height="100" width="100">
    <img ref="newImage" v-show="inputHasImage" class="rounded-circle mb-3" height="100" width="100">
    <br>
    <label>Profile picture</label>
    <input ref="imgInput" @change="inputChange" class="d-block form-control form-control-sm mb-3" type="file" name="image" accept="image/jpeg, image/png">
    <button
      ref="saveBtn"
      @click="submitImage"
      :class="{'not-allowed': !inputHasImage}"
      class="btn btn-sm btn-primary mr-3"
      type="button"
      :disabled="!inputHasImage || savingImage"
    >
      <font-awesome-icon v-if="savingImage" :icon="['fas', 'circle-notch']" spin />
      <template v-else>Save</template>
    </button>
    <button v-show="inputHasImage" @click="removeInputImage" class="btn btn-sm btn-secondary mr-3" type="button">Cancel</button>
    <button v-show="url && showDeleteBtn" @click="deleteImage" class="btn btn-sm btn-danger" type="button">Remove image</button>
  </div>
</template>

<script>
export default {
  name: 'ImageForm',
  data() {
    return {
      inputHasImage: false,
      showDeleteBtn: !!this.$auth.user.image,
      savingImage: false
    }
  },
  computed: {
    url() {
      return this.$auth.user.image
    }
  },
  methods: {
    checkInput() {
      const input = this.$refs.imgInput
      return input.files.length === 1 && ["image/jpeg", "image/png"].includes(input.files[0].type)
    },
    inputChange() {
      this.inputHasImage = this.checkInput()
      this.showDeleteBtn = !this.inputHasImage || this.savingImage
      if (this.inputHasImage) {
        this.$refs.newImage.src = URL.createObjectURL(this.$refs.imgInput.files[0])
      }
    },
    submitImage() {
      if (this.checkInput() && !this.savingImage) {
        this.savingImage = true
        const data = new FormData()
        data.set("field", "image")
        data.set("image", this.$refs.imgInput.files[0])
        this.$axios.post("/api/settings", data)
          .then(() => {
            this.$refs.oldImage.onload = this.removeInputImage
            this.$setUserField({image: this.$refs.newImage.src})
            this.$refs.newImage.src = null
            this.successToast("Profile picture changed")
          })
          .catch(this.displayError)
          .finally(() => this.savingImage = false)
      }
    },
    removeInputImage() {
      this.$refs.imgInput.value = null
      URL.revokeObjectURL(this.$refs.newImage.src)
      this.inputChange()
    },
    deleteImage() {
      if (confirm("Are you sure you want to delete your profile picture?")) {
        this.$axios.delete(`/api/settings?f=image`)
          .then(res => {
            if (res.status === 204) this.$setUserField({image: null})
          })
          .catch(this.displayError)
      }
    }
  }
}
</script>
