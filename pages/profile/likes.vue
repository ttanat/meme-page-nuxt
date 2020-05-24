<template>
  <ProfileManager />
</template>

<script>
import ProfileManager from '~/components/profile/ProfileManager'

export default {
  components: {
    ProfileManager
  },
  middleware: 'custom-auth',
  head() {
    this.$store.commit("setCurrentPage", "Likes")
    return {
      title: `${this.$auth.user.username} - Likes`
    }
  }
}
</script>
