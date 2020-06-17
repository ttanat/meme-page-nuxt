<template>
  <div class="col-md-6 col-lg-3 px-0">
    <div @click="toggleSelected" :class="{selected: selected}" class="media pointer p-2 mb-4">
      <!-- User image or icon -->
      <nuxt-link :to="'/user/'+username" class="user-icon" target="_blank" no-prefetch>
        <font-awesome-icon :icon="['fas', 'user']" class="mr-2 pointer" />
      </nuxt-link>
      <!-- Username -->
      <div class="media-body">
        <nuxt-link :to="'/user/'+username" target="_blank" no-prefetch>
          {{ username }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModItem',
  props: {
    username: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      selected: false
    }
  },
  methods: {
    toggleSelected() {
      this.selected = !this.selected
      this.$emit(this.selected ? "mod-select-event" : "mod-unselect-event")
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
.selected {
  background: #432f10;
}
.user-icon {
  color: lightgrey !important;
}
.ext-link {
  font-size: 12px;
}
@media (max-width: 767.98px) {
  .media {
    width: 100%;
  }
}
</style>
