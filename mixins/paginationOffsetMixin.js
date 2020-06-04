export default {
  methods: {
    increaseOffset(increment=1) {
      if (this.next) {
        const tmp = this.next
        try {
          const url = new URL(this.next)
          const oldOffset = url.searchParams.get("offset")
          url.searchParams.set("offset", increment + (parseInt(oldOffset) || 0))
          this.next = url.href
        } catch (err) {
          this.next = tmp
          console.log(err)
        }
      }
    }
  }
}
