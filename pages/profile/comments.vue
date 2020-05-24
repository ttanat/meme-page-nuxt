<template>
  <ProfileManager />
</template>

<script>
import ProfileManager from '~/components/profile/ProfileManager'

export default {
  middleware: 'custom-auth',
  components: {
    ProfileManager
  },
  head() {
    this.$store.commit("setCurrentPage", "Comments")
    return {
      title: `${this.$auth.user.username} - Comments`
    }
  }
}
</script>
