<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">

        <div class="col-md-11 mb-3">
          <h4>
            Moderators
            <nuxt-link class="btn btn-sm btn-secondary float-right d-none d-lg-inline" :to="'/page/'+$route.params.name">Go back</nuxt-link>
          </h4>
        </div>

        <SettingsSidebar />
        <div class="col-md-9">
          <h5>Add Moderators</h5>
          <AddMods />
          <h5>Pending invites</h5>
          <PendingMods />
          <h5>Current Moderators</h5>
          <CurrentMods />
        </div>

      </div>
    </div>
  </main>
</template>

<script>
import SettingsSidebar from '~/components/page_settings/SettingsSidebar'
import AddMods from '~/components/page_mods/AddMods'
import PendingMods from '~/components/page_mods/PendingMods'
import CurrentMods from '~/components/page_mods/CurrentMods'

export default {
  middleware: 'custom-auth',
  components: {
    SettingsSidebar,
    AddMods,
    PendingMods,
    CurrentMods
  }
}
</script>
