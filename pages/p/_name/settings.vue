<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">

        <div class="col-md-11 mb-2">
          <h4 class="mb-3">
            Settings
            <nuxt-link class="btn btn-sm btn-secondary float-right d-none d-lg-inline" :to="'/p/'+page.name">Go back</nuxt-link>
          </h4>
        </div>

        <SettingsSidebar :admin-view="true" />
        <div class="col-md-5 mb-5 mb-md-1">
          <InfoForm :page-info="page" @change-info-event="changePageInfo" />
        </div>
        <div class="col-md-4 mb-5 mb-md-1">
          <ImageForm :page-image-url="page.image" />
          <br><br>
          <CoverForm :page-cover-url="page.cover" />
        </div>

      </div>
    </div>
    <DeletePageForm :display-name="page.display_name" />
  </main>
</template>

<script>
import SettingsSidebar from '~/components/page_settings/SettingsSidebar'
import ImageForm from '~/components/page_settings/ImageForm'
import CoverForm from '~/components/page_settings/CoverForm'
import InfoForm from '~/components/page_settings/InfoForm'
import DeletePageForm from '~/components/page_settings/DeletePageForm'

export default {
  middleware: 'page-auth',
  components: {
    SettingsSidebar,
    ImageForm,
    CoverForm,
    InfoForm,
    DeletePageForm
  },
  async asyncData({ $axios, route }) {
    const { data } = await $axios.get(`/api/page/${route.params.name}/settings`)
    return { page: data }
  },
  head() {
    this.$store.commit("setCurrentPage", this.page.name)
    return {
      title: `${this.page.display_name || this.page.name} - Settings`,
      meta: [
        {hid: 'robots', name: 'robots', content: 'noindex, imageindex'},
      ]
    }
  },
  methods: {
    changePageInfo(payload) {
      // Set new page data to display in settings
      this.page = Object.assign({}, this.page, payload)
      // Initialize new moderating data in auth user using new page data
      const moderating = this.$auth.user.moderating.map(p =>
        p.name === payload.name ? {name: p.name, dname: payload.display_name, private: payload.private} : p
      )
      // Set new page data in auth user
      this.$setUserField({ moderating })
    },
    removeMods(mods) {
      this.page.mods = this.page.mods.filter(mod => !mods.includes(mod))
    }
  }
}
</script>
