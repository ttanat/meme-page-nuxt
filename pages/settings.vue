<template>
  <main>
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-sm-10 col-md-8 col-lg-6">
          <h4>Settings - {{ $auth.user.username }}</h4>
          <br>
          <ImageForm />
          <NsfwForm :current-filter="data.nsfw_filter" @nsfw-changed-event="changeNsfw" />
          <EmailForm :current-email="data.email" @email-changed-event="changeEmail" />
          <PasswordForm />
          <DeleteAccountForm />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import ImageForm from '~/components/settings/ImageForm'
import NsfwForm from '~/components/settings/NsfwForm'
import EmailForm from '~/components/settings/EmailForm'
import PasswordForm from '~/components/settings/PasswordForm'
import DeleteAccountForm from '~/components/settings/DeleteAccountForm'

export default {
  middleware: 'custom-auth',
  components: {
    ImageForm,
    NsfwForm,
    EmailForm,
    PasswordForm,
    DeleteAccountForm
  },
  async asyncData({ $axios }) {
    const { data } = await $axios.get("/api/settings")
    return { data }
  },
  head() {
    this.$store.commit("setCurrentPage", "Settings")
    return {
      title: "Settings - Meme Page"
    }
  },
  methods: {
    changeNsfw(val) {
      this.data.nsfw_filter = val
    },
    changeEmail(val) {
      this.data.email = val
    }
  }
}
</script>
