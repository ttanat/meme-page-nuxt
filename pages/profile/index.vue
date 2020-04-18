<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">

        <ProfileSideBar />

        <div class="col-md-8 col-xl-9">
          <h5 :style="{paddingLeft: pathname !== '/profile/comments' ? '5px' : ''}" id="profile-page"></h5>
          <div v-if="pathname.startsWith('/user/') || ['/profile', '/profile/likes'].includes(pathname)" class="mb-4" id="tiles">
            <TileItems />
          </div>
          <div v-else-if="pathname === '/profile/comments'" class="container-fluid" id="profile-comments">
            <MyComments />
          </div>
          <div v-else-if="pathname === '/profile/settings'" id="psettings">
            <ProfileSettings />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import ProfileSideBar from '~/components/profile/ProfileSideBar'
import TileItems from '~/components/profile/TileItems'

export default {
  components: {
    ProfileSideBar,
    TileItems
  },
  middleware: "auth",
  computed: {
    pathname() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.container-fluid {
  padding-left: 5%;
  padding-right: 5%;
}
</style>
