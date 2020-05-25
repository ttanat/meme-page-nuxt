<template>
  <form>
    <label>Display name</label>
    <input v-model.trim="page.dname" class="form-control form-control-sm mb-2" type="text" maxlength="32">

    <label>Name</label>
    <input class="form-control form-control-sm mb-2" type="text" :value="$route.params.name" disabled style="cursor: not-allowed;">

    <label>Description</label>
    <textarea v-model.trim="page.description" class="form-control form-control-sm" rows="2" maxlength="150"></textarea>
    <small>{{ 150 - page.description.length }} characters left</small>

    <div class="my-4">
      <label>Who can see posts on this page</label>
      <div class="custom-control custom-radio">
        <input ref="ab" v-model="page.private" type="radio" id="privacy0" class="custom-control-input" :value="false">
        <label class="custom-control-label" for="privacy0">Public (Everyone)</label>
      </div>
      <div class="custom-control custom-radio">
        <input v-model="page.private" type="radio" id="privacy1" class="custom-control-input" :value="true">
        <label class="custom-control-label" for="privacy1">Private (Subscribers)</label>
      </div>
    </div>

    <div class="mb-4">
      <label>Who can post on this page</label>
      <div class="custom-control custom-radio">
        <input v-model="page.permissions" type="radio" id="perm1" class="custom-control-input" :value="true">
        <label class="custom-control-label" for="perm1">Subscribers</label>
      </div>
      <div class="custom-control custom-radio">
        <input v-model="page.permissions" type="radio" id="perm0" class="custom-control-input" :value="false">
        <label class="custom-control-label" for="perm0">Only me</label>
      </div>
    </div>

    <button
      ref="saveBtn"
      @click="saveForm"
      :disabled="objectsAreEqual"
      :class="{'not-allowed': objectsAreEqual}"
      class="btn btn-sm btn-primary mr-3"
      type="button"
    >
      Save
    </button>
    <button class="btn btn-sm btn-danger" @click="deletePage" type="button">Delete page</button>
  </form>
</template>

<script>
export default {
  name: 'InfoForm',
  props: {
    pageInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      page: {
        dname: this.pageInfo.dname,
        description: this.pageInfo.description,
        private: this.pageInfo.private,
        permissions: this.pageInfo.permissions
      }
    }
  },
  computed: {
    initialInfo() {
      return {
        dname: this.pageInfo.dname,
        description: this.pageInfo.description,
        private: this.pageInfo.private,
        permissions: this.pageInfo.permissions
      }
    },
    objectsAreEqual() {
      // Compare this.page with this.initialInfo
      let same = true
      for (const [k, v] of Object.entries(this.initialInfo)) {
        if (v !== this.page[k]) same = false
      }
      return same
    }
  },
  methods: {
    saveForm() {
      const data = new FormData()
      Object.entries(this.page).forEach(([k, v]) => data.set(k, v))
      this.$axios.post(`/api/page/settings/${this.$route.params.name}`, data)
        .then(() => {
          this.$emit("change-info-event", {...this.page})
          this.successToast("Preferences saved")
        })
        .catch(this.displayError)
    },
    deletePage() {
      if (confirm('Are you sure you want to delete this page?')) {
        this.$router.push('/')
        this.errorToast(`${this.pageInfo.dname || this.pageInfo.name} has been deleted :(`, duration=4000)
      }
    }
  }
}
</script>
