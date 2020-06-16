<template>
  <div>
    <div v-if="goingToDeletePage">
      <input
        v-model="password"
        type="password"
        placeholder="Enter your password to confirm"
        class="form-control form-control-sm mr-5 float-right"
        style="width: 300px;"
      >
      <br><br>
    </div>
    <button
      class="btn btn-sm btn-danger float-right mr-5 mb-5"
      @click="deletePage"
      type="button"
      :disabled="goingToDeletePage && !password"
      :class="{'not-allowed': goingToDeletePage && !password}"
    >
      {{ goingToDeletePage ? "Confirm delete" : "Delete page" }}
    </button>
    <button
      v-if="goingToDeletePage"
      @click="goingToDeletePage=false"
      class="btn btn-sm btn-secondary float-right mr-3"
    >
      Cancel
    </button>
  </div>
</template>

<script>
export default {
  name: 'DeletePageForm',
  props: {
    displayName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      goingToDeletePage: false,
      password: ""
    }
  },
  methods: {
    async deletePage() {
      if (this.goingToDeletePage) {
        if (confirm('Are you sure you want to delete this page?')) {
          if (this.password.length < /*6*/1) {
            this.errorToast("Password incorrect")
          } else {
            const data = new FormData()
            data.set("password", this.password)
            this.$axios.post(`/api/delete/page/${this.$route.params.name}`, data)
              .then(({ status }) => {
                if (status === 204) {
                  this.$popUserFieldArray("moderating", this.$route.params.name)
                  this.errorToast(`${this.displayName || this.$route.params.name} has been deleted :(`)
                  this.$router.push('/')
                }
              })
              .catch(err => this.errorToast(err.response ? err.response.data : err.message))
          }
        }
      } else {
        this.goingToDeletePage = true
      }
    }
  }
}
</script>
