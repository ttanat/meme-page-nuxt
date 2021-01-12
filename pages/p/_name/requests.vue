<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-md-11 mb-2">
          <h4 class="mb-3">Requests</h4>
        </div>
        <SettingsSidebar :admin-view="adminView" />
        <div class="col-md-9">
          <!-- Links to join page -->
          <InviteLinks />
          <!-- Requests to subscribe to page -->
          <div>
            <h5>Requests</h5>
            <div v-for="req in requests" :key="req.id" :req="req" class="request py-2 pl-2">
              <nuxt-link :to="'/user/'+req.username" target="_blank" no-prefetch>{{ req.username }}</nuxt-link> wants to subscribe
              &ensp;<small class="text-muted mr-2">{{ new Date(req.timestamp).toUTCString() }}</small>
              <button @click="acceptRequest(req.id)" class="btn btn-sm btn-primary buttons mr-2">Accept</button>
              <button @click="deleteRequest(req.id)" class="btn btn-sm btn-secondary buttons">Delete</button>
            </div>
            <div v-if="loading" class="mt-3 spinner"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
            <div v-else-if="next"><small class="pointer ml-2" @click="loadMore">Load more</small></div>
            <div v-if="noRequests" class="mt-3">No requests pending</div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import SettingsSidebar from '~/components/page_settings/SettingsSidebar'
import InviteLinks from '~/components/page/InviteLinks'

export default {
  middleware: 'page-auth',
  components: {
    SettingsSidebar,
    InviteLinks
  },
  head() {
    this.$store.commit("setCurrentPage", "")
    return {
      title: `${this.pageName} - Requests`,
      meta: [
        {hid: 'robots', name: 'robots', content: 'noindex'},
      ]
    }
  },
  data() {
    return {
      requests: [],
      next: `${this.$axios.defaults.baseURL}/api/subscribe_request/${this.pageName}`,
      loading: false,
      noRequests: false,
      adminView: false
    }
  },
  computed: {
    pageName() {
      return this.$route.params.name
    }
  },
  created() {
    this.$store.commit("setCurrentPage", this.pageName)
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
          this.adminView = data.is_admin
        }
      } catch (err) {
        console.log(err)
      }

      this.loading = false
      if (!this.requests.length) this.noRequests = true
    },
    spliceRequests(id) {
      const i = this.requests.findIndex(req => req.id === id)
      this.requests.splice(i, 1)
    },
    async acceptRequest(id) {
      try {
        const res = await this.$axios.put(`/api/subscribe_request/${this.pageName}?id=${id}`)
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
          const res = await this.$axios.delete(`/api/subscribe_request/${this.pageName}?id=${id}`)
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
.spinner {
  font-size: large;
}
small {
  color: royalblue;
}
</style>