<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">

        <ProfileSideBar />

        <div class="col-md-8 col-xl-9">
          <h5 :style="{paddingLeft: pathname !== '/profile/comments' ? '5px' : ''}">
            {{ pathname === '/profile' ? 'Uploads' : pathname === '/profile/likes' ? 'Likes' : 'Comments' }}
          </h5>
          <TileItems v-if="pathname === '/profile' || pathname === '/profile/likes'" />
          <MyComments v-else-if="pathname === '/profile/comments'" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import ProfileSideBar from '~/components/profile/ProfileSideBar'
import TileItems from '~/components/profile/TileItems'
import MyComments from '~/components/profile/MyComments'

export default {
  name: 'ProfileManager',
  components: {
    ProfileSideBar,
    TileItems,
    MyComments
  },
  computed: {
    pathname() {
      return this.$route.path
    }
  },
}
</script>

<style scoped>
@media (min-width: 575.98px) {
  .container-fluid {
    padding-left: 5%;
    padding-right: 5%;
  }
}
</style>
