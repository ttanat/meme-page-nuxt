<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div id="left" class="col-lg-2 col-xl-2">
          <LeftSidebar />
        </div>
        <div id="mid" class="col-sm-12 col-md-8 col-lg-7 col-xl-6">
          <ListItems v-if="searchListView" />
          <MemeItems v-else />
        </div>
        <div id="right" class="col-md-4 col-lg-3 col-xl-3">
          <div id="right-child">
            <img class="ad" src="~/assets/got_ad.png" alt="Advertisement">
            <TrendingList />
            <div class="right-fixed">
              <img class="ad" src="~/assets/ad_two.png" alt="Advertisement">
              <img class="ad" src="~/assets/ad.png" alt="Advertisement">
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import LeftSidebar from '~/components/LeftSidebar'
import ListItems from '~/components/ListItems'
import MemeItems from '~/components/MemeItems'
import TrendingList from '~/components/TrendingList'

export default {
  name: 'ScrollView',
  components: {
    LeftSidebar,
    ListItems,
    MemeItems,
    TrendingList
  },
  props: {
    searchListView: {
      type: Boolean,
      required: false,
      default: false
    }
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
