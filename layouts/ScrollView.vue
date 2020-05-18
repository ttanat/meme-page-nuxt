<template>
  <div>
    <NavBar />
    <ModalManager />
    <main>
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div id="left" class="col-lg-2 col-xl-2">
            <LeftSidebar />
          </div>
          <div id="mid" class="col-sm-8 col-lg-7 col-xl-6">
            <MemeItems />
          </div>
          <div id="right" class="col-sm-4 col-lg-3 col-xl-3">
            <div class="right-fixed">
              <img class="ad" src="~/assets/got_ad.png" alt="Advertisement">
              <img class="ad" src="~/assets/ad.png" alt="Advertisement">
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import NavBar from '~/components/NavBar'
import ModalManager from '~/components/modals/ModalManager'
import LeftSidebar from '~/components/LeftSidebar'
import MemeItems from '~/components/MemeItems'

export default {
  components: {
    NavBar,
    ModalManager,
    LeftSidebar,
    MemeItems
  }
}
</script>

<style scoped>
@media (max-width: 575.98px) {
  #mid {
    padding: 0 !important;
  }
}
</style>
