<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div id="left" class="col-lg-2 col-xl-2">
          <LeftSidebar />
        </div>
        <div id="mid" class="col-sm-12 col-md-8 col-lg-7 col-xl-6">
          <ListItems v-if="searchListView" @change-num-ads="changeNumAds" />
          <MemeItems v-else @change-num-ads="changeNumAds" />
        </div>
        <div id="right" class="col-md-4 col-lg-3 col-xl-3">
          <div id="right-child">
            <adsbygoogle v-if="showFirstAd" ad-format="rectangle" />
            <TrendingList />
            <div class="right-fixed">
              <adsbygoogle v-if="numAdsToShow > 1" ad-format="rectangle" />
              <adsbygoogle v-if="numAdsToShow > 2" ad-format="rectangle" />
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
import { mapState } from 'vuex'

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
  },
  data() {
    return {
      numAdsToShow: 0
    }
  },
  computed: {
    ...mapState({
      tags: state => state.trendingTags
    }),
    showFirstAd() {
      // Don't show first ad if third ad is showing and there is no trending data
      // Prevents showing three consequtive ads
      if (this.numAdsToShow > 2 && (!this.tags || !this.tags.length)) {
        return false
      }
      return this.numAdsToShow > 0
    }
  },
  methods: {
    changeNumAds(num) {
      this.numAdsToShow = num
    }
  }
}
</script>

<style scoped>
ins {
  margin-bottom: 20px;
}
@media (max-width: 575.98px) {
  #mid {
    padding: 0 !important;
  }
}
</style>
