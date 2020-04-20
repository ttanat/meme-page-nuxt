<template>
  <div>
    <div v-show="!editing" class="bio">
      <span v-if="updating">Updating <font-awesome-icon :icon="['fas', 'circle-notch']" spin /></span><span v-else>{{ bio }}</span>&ensp;<small v-show="!updating" @click="editBio" class="text-muted pointer"><span v-if="!bio" style="font-size: 13px;">Add {{ addText }}&ensp;</span><font-awesome-icon :icon="['fas', 'pen']" /></small>
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
    bioOrDesc: {
      type: String,
      default: "",
      required: true
    },
    addText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      bio: this.bioOrDesc,
      newBio: this.bioOrDesc,
      editing: false,
      updating: false
    }
  },
  methods: {
    editBio() {
      this.editing = !this.editing
      if (this.editing) this.$nextTick(() => this.$refs.textarea.focus())
    },
    saveNew() {
      const data = new FormData()
      data.set("nb", this.newBio)
      this.editing = false


      const IS_PAGE_ADMIN = true


      if (data.get("nb") !== this.bio.trim()) {
        if (this.$route.path.startsWith("/page/") && IS_PAGE_ADMIN) data.set("n", this.$route.path.params.name)
        this.updating = true

        axios.post(data.has("n") ? "/updateDesc" : "/updateBio", data, {headers: {"X-CSRFToken": getCookie('csrftoken'), "X-Requested-With": "XMLHttpRequest"}})
          .then(res => res.data)
          .then(response => {
            this.bio = this.newBio = response["nb"]
          })
          .catch(err => {
            this.editing = true
            display_error(err)
          })
          .finally(() => this.updating = false)
      }
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
