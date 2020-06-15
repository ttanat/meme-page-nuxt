<template>
  <div class="col-md-6 col-lg-3 px-0">
    <div class="media p-2 mb-4">
      <!-- User image or icon -->
      <nuxt-link :to="'/user/'+mod.username" class="user-icon" target="_blank" no-prefetch>
        <img v-if="mod.image" :src="mod.image" class="mr-2 pointer rounded-circle">
        <font-awesome-icon v-else :icon="['fas', 'user']" class="mr-2 pointer" />
      </nuxt-link>
      <!-- Username -->
      <div class="media-body">
        <nuxt-link :to="'/user/'+mod.username" target="_blank" no-prefetch>
          {{ mod.username }}<!--&ensp;<font-awesome-icon :icon="['fas', 'external-link-alt']" class="ext-link" />-->
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModItem',
  props: {
    mod: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.media {
  width: 90%;
  border: 1px solid #333;
  border-radius: 3px;
  background: #151515;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.user-icon {
  color: lightgrey !important;
}
.ext-link {
  font-size: 12px;
}
</style>