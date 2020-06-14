<template>
  <div class="dropdown">
    <a type="button" @click="seen=true" class="nav-item nav-link text-light mr-3" data-toggle="dropdown" title="Notifications">
      <font-awesome-icon :icon="['fas', 'bell']" fixed-width /><span class="d-lg-none"> Notifications</span><!-- Comment here to remove whitespace
   --><small v-if="count && !seen"><small><small class="badge badge-pill badge-danger align-top">{{ count }}</small></small></small>
    </a>
    <div class="dropdown-menu dropdown-menu-right dropdown-dark">
      <h5 class="dropdown-header m-0">Notifications</h5>
      <div v-if="notifications" id="notifications" class="w-100">
        <nuxt-link v-for="(notification, index) in notifications" :key="index" :to="notification.link" class="notification row">
          <div class="notif-left-column">
            <img
              v-if="notification.image"
              :src="$axios.defaults.baseURL+notification.image"
              height="50"
              width="50"
              style="border-radius: 3px;"
            >
            <font-awesome-icon
              v-else-if="notification.message.includes('your comment')"
              :icon="['fas', 'comment']"
              style="font-size: 25px;"
            />
            <font-awesome-icon v-else :icon="['fas', 'user-circle']" class="notif-icon" />
          </div>
          <div class="notif-right-column">{{ notification.message }}</div>
        </nuxt-link>
      </div>
      <div v-else>None</div>
      <div class="dropdown-divider"></div>
      <nuxt-link class="dropdown-item" to="/notifications">View all</nuxt-link>
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
  mounted() {
    if (this.$route.name !== "notifications") {
      setTimeout(async () => {
        const { data } = await this.$axios.get(`/api/notifications/nav`)
        this.notifications.push(...data.list)
        this.count = data.count
      }, /*150*/0)
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
