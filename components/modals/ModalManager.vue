<template>
  <div>
    <template v-if="$auth.loggedIn">
      <NewPageModal />
      <UploadModal />
    </template>
    <template v-else>
      <LoginModal />
      <RegisterModal />
    </template>
  </div>
</template>

<script>
import NewPageModal from './NewPageModal'
import UploadModal from './UploadModal'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'

export default {
  name: 'ModalManager',
  components: {
    NewPageModal,
    UploadModal,
    LoginModal,
    RegisterModal
  }
}
</script>

<style scoped>
  
</style>
