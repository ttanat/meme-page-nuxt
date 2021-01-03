<template>
  <main class="px-3 px-md-4 px-xl-5">
    <h5>Notifications</h5>
    <div v-for="pname in modInvites" :key="pname" class="notif py-2 pl-2">
      Moderator invite for <nuxt-link :to="'/p/'+pname" no-prefetch>{{ pname }}</nuxt-link>
      &ensp;<small class="text-muted">Accept to become a moderator of this page</small>
      &ensp;<nuxt-link :to="'/p/'+pname" class="ext-link" target="_blank" no-prefetch><font-awesome-icon :icon="['fas', 'external-link-alt']" /></nuxt-link>
      <div class="float-right">
        <button @click="acceptModInvite(pname)" class="btn btn-sm btn-primary buttons mr-2" title="Accept">Accept</button>
        <button @click="declineModInvite(pname)" class="btn btn-sm btn-secondary buttons" title="Decline">Decline</button>
      </div>
    </div>
    <div v-for="(notif, i) in notifications" :key="i" :class="{'not-seen': !notif.seen}" class="notif py-2 pl-2">
      <nuxt-link :to="'/user/'+getUsername(notif.message)" no-prefetch>{{ getUsername(notif.message) }}</nuxt-link> {{ splitMessage(notif.message) }}
      &ensp;<small class="text-muted">{{ new Date(notif.timestamp).toUTCString() }}</small>
      &ensp;<nuxt-link :to="notif.link" class="ext-link" target="_blank" no-prefetch><font-awesome-icon :icon="['fas', 'external-link-alt']" /></nuxt-link>
    </div>
    <div v-if="loading" id="spinner" class="mt-3"><font-awesome-icon :icon="['fas', 'circle-notch']" spin /></div>
    <div v-else-if="next"><small class="pointer ml-2" @click="loadMore">Load more</small></div>
    <div v-else-if="!notifications.length && !modInvites.length" class="mt-3">None</div>
  </main>
</template>

<script>
export default {
  middleware: 'custom-auth',
  head() {
    this.$store.commit("setCurrentPage", "")
    return {
      title: "Notifications - Meme Page",
      meta: [
        {hid: 'robots', name: 'robots', content: 'noindex'},
      ]
    }
  },
  data() {
    return {
      modInvites: [],
      notifications: [],
      next: `${this.$axios.defaults.baseURL}/api/notifications/?page=1`, // Need baseURL to parse URL in loadMore
      loading: false
    }
  },
  created() {
    this.loadMore()
    this.$axios.get(`/api/mods/handle_invite`)
      .then(({ data }) => this.modInvites.push(...data))
      .catch(console.log)
  },
  methods: {
    acceptModInvite(pname) {
      this.$axios.put(`/api/mods/handle_invite/${pname}`)
        .then(({ data }) => {
          this.modInvites = this.modInvites.filter(pn => pn !== pname)
          this.$appendUserFieldArray("moderating", {
            name: pname,
            dname: data.dname,
            private: data.private
          })
        })
        .catch(console.log)
    },
    declineModInvite(pname) {
      this.$axios.delete(`/api/mods/handle_invite/${pname}`)
        .then(() => this.modInvites = this.modInvites.filter(pn => pn !== pname))
        .catch(console.log)
    },
    async loadMore() {
      if (this.next === null) return false
      this.loading = true
      try {
        const { data } = await this.$axios.get(this.next)
        this.notifications.push(...data.results)
        if (data.next) {
          const url = new URL(this.next)
          url.searchParams.set("page", data.next)
          this.next = url.href
        } else {
          this.next = null
        }
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
.buttons {
  padding: 1px 5px;
  font-size: 13px;
}
</style>
