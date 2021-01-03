<script>
export default {
  middleware({ params, redirect }) {
    return redirect(301, `/user/${params.username}`)
  }
}
</script>
