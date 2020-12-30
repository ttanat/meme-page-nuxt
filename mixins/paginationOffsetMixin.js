export default {
  methods: {
    increaseOffset(increment=1) {
      if (this.next) {
        const tmp = this.next
        try {
          const url = new URL(this.next)
          const oldOffset = url.searchParams.get("offset")
          const newOffset = increment + (parseInt(oldOffset) || 0)
          if (newOffset > 0) {
            url.searchParams.set("offset", newOffset)
            this.next = url.href
          }
        } catch (err) {
          this.next = tmp
          console.log(err)
        }
      }
    }
  }
}
