<template>
  <div class="list-group mt-4 mb-5">
    <nuxt-link
      :to="'/p/'+page.name+'/moderators'"
      class="list-group-item list-group-item-action py-2 mods-list-title"
      no-prefetch
    >
      Moderators
    </nuxt-link>
    <nuxt-link
      :to="'/user/'+page.admin"
      class="list-group-item list-group-item-action py-2 mods-list"
      no-prefetch
    >
      {{ page.admin }} (admin)
    </nuxt-link>
    <nuxt-link
      v-for="mod in page.moderators"
      :key="mod"
      :to="'/user/'+mod"
      class="list-group-item list-group-item-action py-2 mods-list"
      no-prefetch
    >
      {{ mod }}
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'ModsList',
  props: {
    page: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.mods-list-title {
  background: darkgreen;
  color: white;
}
.mods-list {
  font-size: 14px;
}
</style>