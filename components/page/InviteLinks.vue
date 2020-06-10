<template>
  <div class="col-lg-5">
    <h5 title="Maximum 100">Invite Links ({{ links.length }})</h5>
    <div class="my-3">
      <input v-model.number="newLinkUses" class="form-control-sm" type="number" min="1" max="100" placeholder="Number of uses" title="Min 1, Max 100">
      <button @click="newLink" :disabled="disableBtn" :class="{'not-allowed': disableBtn}" class="btn btn-sm btn-success float-right">
        <font-awesome-icon v-if="generating" :icon="['fas', 'circle-notch']" spin />
        <template v-else>Generate new link</template>
      </button>
    </div>
    <div v-for="link in links" :key="link.uuid" class="link py-2 px-1">
      {{ getOrigin }}/invite/{{ link.uuid }}
      <a @click="copyLink(link.uuid)" class="mx-2" href="javascript:void(0);">Copy</a>
      <span class="text-muted" style="font-size: 14px;">{{ link.uses }} uses left</span>
      <a @click="deleteLink(link.uuid)" class="red float-right" title="Delete" href="javascript:void(0);"><font-awesome-icon :icon="['fas', 'times']" /></a>
    </div>
    <div v-if="!$fetchState.pending && !links.length">No links generated</div>
  </div>
</template>

<script>
import copy from 'copy-to-clipboard'

export default {
  name: 'InviteLinks',
  data() {
    return {
      links: [],
      newLinkUses: "",
      generating: false
    }
  },
  computed: {
    newLinkUsesValid() {
      return typeof this.newLinkUses === "number" && this.newLinkUses > 0 && this.newLinkUses < 101 && Number.isInteger(this.newLinkUses)
    },
    disableBtn() {
      return !this.newLinkUsesValid || this.generating
    },
    getOrigin() {
      return window.location.origin
    }
  },
  async fetch() {
    const { data } = await this.$axios.get(`/api/invite/${this.$route.params.name}`)
    this.links.push(...data)
  },
  methods: {
    copyLink(uuid) {
      copy(`${window.location.origin}/invite/${uuid}`)
      this.$toast.success("Copied", {
        position: 'top-center',
        duration: 1000
      })
    },
    newLink() {
      if (!this.newLinkUsesValid) return false
      this.generating = true
      const data = new FormData()
      data.set("uses", this.newLinkUses)
      this.$axios.post(`/api/invite/${this.$route.params.name}`, data)
        .then(res => res.data)
        .then(data => {
          this.links.push(data)
          this.newLinkUses = ""
        })
        .catch(console.log)
        .finally(() => this.generating = false)
    },
    async deleteLink(uuid) {
      if (confirm("Are you sure you want to delete this link?")) {
        const res = await this.$axios.delete(`/api/invite/${uuid}`)
        if (res.status === 204) {
          const i = this.links.findIndex(link => link.uuid === uuid)
          this.links.splice(i, 1)
        }
      }
    }
  }
}
</script>

<style scoped>
.link {
  font-size: 15px;
  border-bottom: 1px solid #555;
}
input {
  border: none;
  outline: none;
}
</style>