<template>
  <div class="dropdown">
    <a @click="seen=true" class="nav-item nav-link text-light mr-3 pointer" data-toggle="dropdown" title="Notifications">
      <font-awesome-icon :icon="['fas', 'bell']" fixed-width /><span class="d-md-none"> Notifications</span><!-- Comment here to remove whitespace
   --><small v-if="count && !seen"><small><small class="badge badge-pill badge-danger align-top">{{ count }}</small></small></small>
    </a>
    <div class="dropdown-menu dropdown-menu-right dropdown-dark">
      <h5 class="dropdown-header m-0">Notifications</h5>
      <div v-if="notifications.length" id="notifications" class="w-100">
        <nuxt-link
          v-for="(notif, index) in notifications"
          :key="index"
          :to="notif.link"
          class="notification row"
          no-prefetch
        >
          <div class="notif-left-column">
            <img
              v-if="notif.image"
              :src="notif.image"
              :class="{'rounded-circle': isUserImage(notif.message)}"
              :style="{borderRadius: isUserImage(notif.message) ? '' : '3px'}"
              height="50"
              width="50"
            >
            <font-awesome-icon
              v-else-if="notif.message.includes('your comment')"
              :icon="['fas', 'comment']"
              style="font-size: 25px;"
            />
            <font-awesome-icon v-else :icon="['fas', 'user-circle']" class="notif-icon" />
          </div>
          <div class="notif-right-column">{{ notif.message }}</div>
        </nuxt-link>
      </div>
      <div v-else class="no-notifs">
        <nuxt-link v-if="count" to="/notifications">See invites</nuxt-link>
        <template v-else>None</template>
      </div>
      <div class="dropdown-divider"></div>
      <nuxt-link class="dropdown-item" to="/notifications" no-prefetch>View all</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationsDropdown',
  data() {
    return {
      notifications: [],
      count: 0,
      seen: false
    }
  },
  async mounted() {
    if (this.$route.name !== "notifications" && !this.$store.state.justRegistered) {
      const { data } = await this.$axios.get(`/api/notifications/nav`)
      this.notifications.push(...data.results)
      this.count = data.count
    }
  },
  methods: {
    isUserImage(message) {
      return message.match(/^[a-zA-Z0-9_]{1,32} (followed you$|replied to your comment$|subscribed to [a-zA-Z0-9_]{1,32}$)/)
    }
  }
}
</script>

<style scoped>
.dropdown-menu {
  width: 335px;
  background-color: #252525;
  color: lightgrey;
}
.no-notifs {
  font-size: 14px;
  padding: 5px 14px 5px 24px;
}
.notification {
  width: 100%;
  font-size: 14px;
  padding: 5px 14px;
  margin: 0 !important;
  cursor: pointer;
  color: lightgrey;
}
.notification:hover {
  background-color: #363636;
}
.notification:active {
  background-color: #007bff;
  color: white;
}
.notif-left-column {
  width: 70px;
  text-align: center;
}
.notif-icon {
  font-size: 50px;
}
.notif-right-column {
  width: 235px;
}
.notif-right-column > a {
  height: 80px;
  text-align: left;
}
.dropdown-item {
  text-align: center;
  font-size: small;
}
@media (max-width: 575.98px) {
  .dropdown-menu {
    width: 300px;
  }
  .notif-right-column {
    width: 200px;
  }
}
</style>
