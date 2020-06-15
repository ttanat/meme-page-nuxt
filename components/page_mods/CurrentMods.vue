<template>
  <div class="container-fluid">
    <div class="row">
      <ModItem v-for="mod in moderators" :key="mod.username" :mod="mod" />
    </div>
  </div>
</template>

<script>
import ModItem from '~/components/page_mods/ModItem'

export default {
  name: 'CurrentMods',
  components: {
    ModItem
  },
  data() {
    return {
      moderators: [{username: "max"}, {username: "jane"}, {username: "moseby"}, {username: "kevin"}, {username: "allison"}],
      next: `/api/page/${this.$route.params.name}/moderators?page=1`,
      loading: false
    }
  }
}
</script>
