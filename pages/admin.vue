<template>
  <div>
    <h3 v-if="loading"><font-awesome-icon :icon="['fas', 'circle-notch']" spin />&ensp;Loading admin site</h3>
    <img v-else src="~/assets/sike.jpg">
  </div>
</template>

<script>
export default {
  layout: 'plain',
  data() {
    return {
      loading: true
    }
  },
  head() {
    return {
      title: "Admin",
      meta: [
        { hid: 'robots', name: 'robots', content: 'noindex, noimageindex' }
      ]
    }
  },
  mounted() {
    this.$axios.get("/api/admin")
      .then(({ data }) => {
        // Fake function and route
        this.$router.push(`/${data.route}?token=${data.token}`)
      })
      .catch(console.log)
      .finally(() => this.loading = false)
  }
}
</script>

<style scoped>
div {
  text-align: center;
}
h3 {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  word-spacing: 1px;
}
img {
  height: 100vh;
}
</style>
