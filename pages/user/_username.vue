<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">

        <ProfileSideBar />

        <div class="col-md-8 col-xl-9">
          <h5 :style="{paddingLeft: $route.path !== '/profile/comments' ? '5px' : ''}" id="profile-page"></h5>
          <TileItems v-if="$route.path.startsWith('/user/')" />
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
  }
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
