<template>
  <main>
    <div class="container-fluid mb-3">
      <div class="row justify-content-center">

        <div class="col-md-11 mb-2">
          <h4 class="mb-3">
            Settings - <nuxt-link :to="'/page/'+page.name" style="color: inherit;">{{ page.display_name || page.name }}</nuxt-link>
            <nuxt-link class="btn btn-sm btn-secondary float-right" :to="'/page/'+page.name">Go back</nuxt-link>
          </h4>
        </div>

        <div class="col-md-3 mb-5">
          <ImageForm :page-image-url="page.image" />
          <br><br>
          <CoverForm :page-cover-url="page.cover" />
        </div>
        <div class="col-md-5 mb-5">
          <InfoForm :page-info="page" @change-info-event="changePageInfo" />
        </div>
        <div class="col-md-3">
          <CurrentMods :mods="page.mods" @remove-mods-event="removeMods" />
          <!-- <label>Requests pending</label>
          <ul class="list-group mb-4">
            <button v-for="username in page.pending" :key="username" type="button" class="list-group-item list-group-item-action">{{ username }}</button>
          </ul> -->
          <AddMods />
        </div>

      </div>
    </div>
  </main>
</template>

<script>
import ImageForm from '~/components/page_settings/ImageForm'
import CoverForm from '~/components/page_settings/CoverForm'
import InfoForm from '~/components/page_settings/InfoForm'
import CurrentMods from '~/components/page_settings/CurrentMods'
import AddMods from '~/components/page_settings/AddMods'

export default {
  components: {
    ImageForm,
    CoverForm,
    InfoForm,
    CurrentMods,
    AddMods
  },
  async asyncData({ $axios, route }) {
    const { data } = await $axios.get(`/api/page/${route.params.name}/settings`)
    return { page: data }
  },
  mounted() {
    // Delete this later
    this.page.mods = ["max", "moseby", "jane", "kevin"]
    this.page.pending = ["max", "moseby", "jane", "kevin"]
  },
  head() {
    this.$store.commit("setCurrentPage", "")
    return {
      title: `${this.page.display_name || this.page.name} - Settings`
    }
  },
  methods: {
    changePageInfo(payload) {
      this.page = Object.assign({}, this.page, payload)
    },
    removeMods(mods) {
      this.page.mods = this.page.mods.filter(mod => !mods.includes(mod))
    }
  }
}
</script>
