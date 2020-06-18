<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <ModItem
          v-for="username in pending"
          :key="username"
          :username="username"
          @mod-select-event="numSelected++"
          @mod-unselect-event="numSelected--"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ModItem from './ModItem'

export default {
  name: 'PendingMods',
  components: {
    ModItem
  },
  props: {
    pending: {
      type: Array,
      required: true
    }
  }
}
</script>
