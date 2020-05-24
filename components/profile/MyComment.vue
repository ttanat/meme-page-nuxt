<template>
  <div class="row list-row my-4">
    <div>
      <div class="list-content" :style="listStyle">
        <span v-if="comment.rt && rpattern"><nuxt-link :to="'/user/'+rpattern[1]" target="_blank">{{ rpattern[0] }}</nuxt-link>{{ contentAfterMention }}</span>
        <template v-else>{{ comment.content }}</template> {{ comment.rt ? " " : "" }}<small v-if="comment.rt" class="text-muted">replying to {{ replyingTo }}</small>
      </div>
      <template v-if="comment.url">
        <nuxt-link :to="'/img?c='+comment.uuid" target="_blank">
          <img :src="comment.url" class="mt-1">
        </nuxt-link>
        <br>
      </template>
      <nuxt-link :to="'/m/'+comment.m_uuid" target="_blank">
        <small class="text-muted">Go to meme</small>&nbsp;<font-awesome-icon class="small" :icon="['fas', 'external-link-alt']" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyComment',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  computed: {
    rpattern() {
      return this.comment.content.match(/^@([a-z0-9_]+) /i)
    },
    contentAfterMention() {
      return this.comment.content.slice(this.comment.content.indexOf(" "))
    },
    replyingTo() {
      return this.comment.rt && this.rpattern ? this.rpattern[1] : this.comment.rt
    }
  }
}
</script>

<style scoped>
.list-content {
  font-size: 15px;
}
img {
  height: 15rem;
  border-radius: .5rem;
}
</style>