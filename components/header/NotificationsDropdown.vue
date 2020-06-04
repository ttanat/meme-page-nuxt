<template>
  <div class="dropdown">
    <a type="button" @click="seen=true" class="nav-item nav-link text-light mr-2" id="notif-btn" data-toggle="dropdown">
      <font-awesome-icon :icon="['fas', 'bell']" /><!-- Comment here to remove whitespace
   --><small v-if="count && !seen"><small><small class="badge badge-pill badge-danger align-top">{{ count }}</small></small></small>
    </a>
    <div class="dropdown-menu dropdown-menu-right">
      <h5 class="dropdown-header m-0">Notifications</h5>
      <div v-if="notifications" id="notifications" class="w-100">
        <div v-for="(notification, index) in notifications" :key="index" class="notification row">
          <div class="notif-left-column">
            <img v-if="notification.image" class="rounded-circle" :src="notification.image" height="50" width="50">
            <font-awesome-icon v-else :icon="['fas', 'user-circle']" style="font-size: 50px;" />
          </div>
          <div class="notif-right-column">{{ notification.message }}</div>
        </div>
      </div>
      <div v-else>None</div>
      <div class="dropdown-divider"></div>
      <nuxt-link class="dropdown-item user-dropdown" to="/notifications">View all</nuxt-link>
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
    setTimeout(async () => {
      // this.$axios.get("/api/notifications")
      //   .then(res => this.notifications.push(...res.data))
      //   .catch(console.log)
      const { data } = await this.$axios.get(`/api/unread_list/`)
      this.notifications.push(...data.unread_list)
      this.count = data.unread_count
    }, 1500)
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
}
.notification:hover {
  background-color: #303030;
}
.notification:active {
  background-color: #007bff;
  color: white;
}
.notif-left-column {
  width: 70px;
  text-align: center;
}
.notif-right-column {
  width: 235px;
}
.notif-right-column > a {
  height: 80px;
  text-align: left;
}
.user-dropdown {
  text-align: center;
  font-size: small;
}
</style>
