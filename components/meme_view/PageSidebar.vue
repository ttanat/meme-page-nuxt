<template>
  <div class="page-container mb-4 p-3">
    <nuxt-link :to="page.name" no-prefetch>
      <span v-if="page.image"><img :src="page.image" class="rounded-circle" height="40" width="40">&nbsp;</span>
      <span style="color: lightgrey;">{{ page.dname || page.name }}</span>
    </nuxt-link>
    <div class="my-2" style="font-size: 14px;">{{ page.description }}</div>
    <table class="w-100">
      <tr>
        <!-- Plus one to include admin -->
        <td>{{ formatNumber(page.num_subs + 1) }}</td>
        <td>{{ formatNumber(page.num_posts) }}</td>
      </tr>
      <tr style="line-height: 1;">
        <td><small>members</small></td>
        <td><small>posts</small></td>
      </tr>
    </table>
  </div>
</template>

<script>
import formatNumberMixin from '~/mixins/formatNumberMixin'

export default {
  name: 'PageSidebar',
  props: {
    page: {
      type: Object,
      required: true
    }
  },
  mixins: [formatNumberMixin],
}
</script>

<style scoped>
.page-container {
  /* width: 100%; */
  /* width: 270px; */
  /* margin: 0 auto; */
  background-color: #171717;
  border: 1px solid #444;
  border-radius: 7px;
}
</style>