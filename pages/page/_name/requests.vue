<template>
  <main class="px-3 px-md-4 px-xl-5">
    <nuxt-link :to="'/page/'+$route.params.name" class="btn btn-secondary btn-sm mb-4" no-prefetch>Back</nuxt-link>
    <h5>Requests</h5>
    <div v-for="req in requests" :key="req.id" :req="req" class="request py-2 pl-2">
      <nuxt-link :to="'/user/'+req.username" target="_blank" no-prefetch>{{ req.username }}</nuxt-link> wants to subscribe
      &ensp;<small class="text-muted">{{ new Date(req.timestamp).toString() }}</small>
      <button @click="acceptRequest(req.id)" class="btn btn-sm btn-primary buttons ml-2">Accept</button>
      <button @click="deleteRequest(req.id)" class="btn btn-sm btn-secondary buttons ml-2">Delete</button>
    </div>
    <div v-if="loading" id="spinner" class="mt-3"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
    <div v-else-if="next"><small class="pointer ml-2" @click="loadMore">Load more</small></div>
    <div v-if="noRequests" class="mt-3">No requests pending</div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      requests: [],
      next: `${this.$axios.defaults.baseURL}/api/subscribe_request/${this.$route.params.name}`,
      loading: false,
      noRequests: false
    }
  },
  created() {
    this.loadMore()
  },
  methods: {
    async loadMore() {
      if (this.next === null) return false
      this.loading = true
      try {
        const { data } = await this.$axios.get(this.next)
        this.requests.push(...data.results)
        if (data.lid) {
          const url = new URL(this.next)
          url.searchParams.set("lid", data.lid)
          this.next = url.href
        } else {
          this.next = null
        }
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
      if (!this.requests.length) this.noRequests = true
    },
    spliceRequests(id) {
      const i = this.requests.findIndex(req => req.id === id)
      this.requests.splice(i, 1)
    },
    async acceptRequest(id) {
      try {
        const res = await this.$axios.put(`/api/subscribe_request/${this.$route.params.name}?id=${id}`)
        if (res.status === 204) {
          this.spliceRequests(id)
        }
      } catch (err) {
        console.log(err)
      }
    },
    async deleteRequest(id) {
      if (confirm("Are you sure you want to delete this request?")) {
        try {
          const res = await this.$axios.delete(`/api/subscribe_request/${this.$route.params.name}?id=${id}`)
          if (res.status === 204) {
            this.spliceRequests(id)
          }
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
}
</script>

<style scoped>
.request {
  font-size: 15px;
  border-bottom: 1px solid #555;
}
a:not(.btn) {
  color: royalblue;
  text-decoration: underline !important;
}
.buttons {
  padding: 1px 5px;
  font-size: 13px;
}
#spinner {
  font-size: large;
}
small {
  color: royalblue;
}
</style>