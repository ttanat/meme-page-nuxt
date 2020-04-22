<template>
  <div>
    <div v-show="!editing" class="bio">
      <span v-if="updating">Updating <font-awesome-icon :icon="['fas', 'circle-notch']" spin /></span>
      <span v-else>{{ currentBio }}</span>&ensp;<small v-show="!updating" @click="editBio" class="text-muted pointer"><span v-if="!currentBio" style="font-size: 13px;">Add {{ addText }}&ensp;</span><font-awesome-icon :icon="['fas', 'pen']" /></small>
    </div>
    <textarea ref="textarea" v-show="editing" v-model.trim="newBio" placeholder="Add your page description here!" rows="3"></textarea>
    <span>
      <small v-show="editing" @click="editBio" class="text-muted pointer">Close</small>
      <small v-show="editing" @click="saveNew" class="text-muted pointer">&emsp;Save</small>
    </span>
  </div>
</template>

<script>
export default {
  name: 'BioDescription',
  props: {
    currentBio: {
      type: String,
      required: true
    },
    addText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      firstEdit: true, // First time clicking to edit bio since loading page
      newBio: this.currentBio,
      editing: false,
      updating: false
    }
  },
  methods: {
    editBio() {
      if (this.firstEdit) {
        this.newBio = this.currentBio
        this.firstEdit = false
      }
      this.editing = !this.editing
      if (this.editing) this.$nextTick(() => this.$refs.textarea.focus())
    },
    bioNoChange() {
      // New line in currentBio is '\r\n' but in newBio is '\n'
      return this.currentBio.replace(/\r\n|\n/g, ' ') === this.newBio.replace(/\r\n|\n/g, ' ')
    },
    saveNew() {
      const data = new FormData()
      data.set("nb", this.newBio)
      this.editing = false
      if (this.bioNoChange()) return false // Don't send if bio is same

      const IS_PAGE_ADMIN = true


      if (this.$route.path.startsWith("/page/")) {
        if (IS_PAGE_ADMIN) {
          data.set("n", this.$route.path.params.name)
        } else {
          return false
        }
      } 

      this.updating = true

      this.$axios.post(data.has("n") ? "/updateDesc" : "/updateBio", data, {progress: false})
        .then(res => res.data.nb)
        .then(new_bio => {
          this.$emit("bio-change-event", new_bio)
          this.newBio = new_bio
        })
        .catch(err => {
          this.editBio()
          this.displayError(err)
        })
        .finally(() => this.updating = false)
    }
  }
}
</script>

<style scoped>
.bio {
  font-size: 14px;
  white-space: pre-wrap;
}
textarea {
  width: 100%;
  border: none;
  border-radius: 3px;
  padding-left: 3px;
  font-size: 14px;
}
</style>
