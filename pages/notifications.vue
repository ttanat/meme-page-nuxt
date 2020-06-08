<template>
  <main class="px-3 px-md-4 px-xl-5">
    <h5>Notifications</h5>
    <div v-for="(notif, i) in notifications" :key="i" :notif="notif" :class="{'not-seen': !notif.seen}" class="notif py-2 pl-2">
      <nuxt-link :to="'/user/'+getUsername(notif.message)">{{ getUsername(notif.message) }}</nuxt-link> {{ splitMessage(notif.message) }}
      &ensp;<small class="text-muted">{{ new Date(notif.timestamp).toString() }}</small>
      &ensp;<nuxt-link :to="notif.link" class="ext-link"><font-awesome-icon :icon="['fas', 'external-link-alt']" /></nuxt-link>
    </div>
    <div v-if="loading" id="spinner" class="mt-3"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
    <div v-else-if="nextLink"><small class="pointer ml-2" @click="loadMore">Load more</small></div>
  </main>
</template>

<script>
export default {
  middleware: 'custom-auth',
  data() {
    return {
      notifications: [],
      nextLink: "/api/notifications/",
      loading: false
    }
  },
  created() {
    this.loadMore()
  },
  methods: {
    async loadMore() {
      this.loading = true
      try {
        const { data } = await this.$axios.get(this.nextLink)
        this.notifications.push(...data.results)
        this.nextLink = data.next
      } catch (err) {
        console.log(err)
      } finally {
        this.loading = false
      }
    },
    getUsername(message) {
      return message.split(" ")[0]
    },
    splitMessage(message) {
      return message.split(" ").slice(1).join(" ")
    }
  }
}
</script>

<style scoped>
.not-seen {
  background: #331f00;
}
.notif {
  font-size: 14px;
  border-bottom: 1px solid #555;
}
a {
  color: royalblue;
  text-decoration: underline !important;
}
.ext-link {
  font-size: 12px;
}
#spinner {
  font-size: large;
}
small {
  color: royalblue;
}
</style>
