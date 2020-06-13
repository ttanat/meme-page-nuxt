<template>
  <main>
    <div v-if="$auth.loggedIn" id="outerDiv">
      <div id="innerDiv">
        <template v-if="valid">
          <img v-if="image" :src="image" height="75" width="75" class="rounded-circle mb-4"><br>
          <div class="mb-4">Do you want to subscribe to {{ dname || name }}?</div>
          <nuxt-link to="/" type="button" class="btn btn-sm btn-outline-success mr-3" style="width: 90px;" no-prefetch>Back</nuxt-link>
          <button @click="subscribe" type="button" class="btn btn-sm btn-success" style="width: 90px;">Subscribe</button>
        </template>
        <template v-else>
          <p>Link is no longer valid or doesn't exist :(</p>
          <p>Return <nuxt-link to="/" no-prefetch>home</nuxt-link></p>
        </template>
      </div>
    </div>
    <div v-else id="outerDiv">
      <div id="innerDiv">
        <p>Please sign up or log in to continue&ensp;<font-awesome-icon id="arrow" :icon="['fas', 'arrow-right']" /></p>
        <p>or return <nuxt-link to="/" no-prefetch>home</nuxt-link></p>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  async asyncData({ $axios, $auth, route }) {
    if (!$auth.loggedIn) return {}
    const { data } = await $axios.get(`/api/invite/${route.params.uuid}`)
    return data
  },
  methods: {
    subscribe() {
      this.$axios.put(`/api/invite/${this.$route.params.uuid}`)
        .then(res => {
          this.$router.push(`/page/${res.data.name}`)
          this.successToast("You are now subscribed")
          this.addNewPage()
        })
        .catch(err => {
          this.errorToast(err.response.data || err.message)
          if (err.response.data === "Link is no longer valid") this.valid = false
        })
    },
    addNewPage() {
      const current_page = {
        dname: this.dname || "",
        name: this.name,
        private: true
      }
      const new_subscriptions = [...this.$auth.user.subscriptions, current_page]
      this.$auth.setUser(Object.assign({}, this.$auth.user, {subscriptions: new_subscriptions}))
    }
  }
}
</script>

<style scoped>
#outerDiv {
  min-height: 80vh;
  position: relative;
  display: flex;
  justify-content: center;
}
#innerDiv {
  text-align: center;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}
#arrow {
  rotate: -45deg;
  color: royalblue;
}
</style>
