<template>
  <table class="mb-3 w-100 text-center">
    <tr>
      <td title="Total points">{{ formatNumber(stats.clout) }}</td>
      <td class="pointer" id="follower-count">{{ formatNumber(stats.num_followers) }}</td>
      <td class="pointer">{{ formatNumber(stats.num_following) }}</td>
    </tr>
    <tr>
      <td title="Total points"><small>clout</small></td>
      <td class="pointer"><small>followers</small></td>
      <td class="pointer"><small>following</small></td>
    </tr>
  </table>
</template>

<script>
import formatNumberMixin from '~/mixins/formatNumberMixin'

export default {
  name: 'UserStats',
  mixins: [formatNumberMixin],
  props: {
    stats: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
table {
  table-layout: fixed;
}
</style>