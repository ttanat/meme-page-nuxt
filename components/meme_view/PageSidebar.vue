<template>
  <div class="page-container mb-4 p-3">
    <!-- Show page name and display name -->
    <div v-if="page.dname" class="row pl-3">
      <div v-if="page.image">
        <nuxt-link :to="'/p/'+page.name" no-prefetch>
          <img :src="page.image" class="rounded-circle" height="40" width="40" style="margin-top: 1px;">&nbsp;
        </nuxt-link>
      </div>
      <div>
        <div>
          <nuxt-link :to="'/p/'+page.name" class="page-sidebar-link" no-prefetch>
            {{ page.dname }}
          </nuxt-link>
        </div>
        <div style="font-size: 12px;">
          <nuxt-link :to="'/p/'+page.name" class="text-muted" no-prefetch>
            {{ page.name }}
          </nuxt-link>
        </div>
      </div>
    </div>
    <!-- Show just page name -->
    <nuxt-link v-else :to="'/p/'+page.name" no-prefetch>
      <span v-if="page.image"><img :src="page.image" class="rounded-circle" height="40" width="40">&nbsp;</span>
      <span class="page-sidebar-link">{{ page.dname || page.name }}</span>
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
.page-sidebar-link {
  color: lightgrey;
}
</style>