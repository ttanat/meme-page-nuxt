<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">

        <ProfileSideBar />

        <div class="col-md-8 col-xl-9">
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
  middleware: 'profile-redirect',
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
