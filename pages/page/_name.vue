<script>
export default {
  middleware({ params, redirect }) {
    return redirect(`/p/${params.name}`)
  }
}
</script>
