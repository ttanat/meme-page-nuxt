<template>
  <div>
    <template v-if="$auth.loggedIn">
      <NewPageModal />
      <UploadModal />
      <ReportModal />
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
import ReportModal from './ReportModal'
import LoginModal from './LoginModal'
import RegisterModal from './RegisterModal'

export default {
  name: 'ModalManager',
  components: {
    NewPageModal,
    UploadModal,
    ReportModal,
    LoginModal,
    RegisterModal
  }
}
</script>

<style scoped>
  
</style>
