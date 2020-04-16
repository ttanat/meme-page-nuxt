/* 
  Components using this mixin have two data attributes: scrollObserver and scrollRoot

  scrollObserver: Intersection observer object, tracks scrollRoot for loading more content
  scrollRoot: Element near bottom of page being tracked by scrollObserver
*/

export default {
  mounted() {
    this.scrollObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && this.next !== null) {
        this.loadMore()
        this.next = null  // Prevent loading same page more than once
      }
    })
  },
  updated() {
    if (this.scrollObserver) {
      if (this.scrollRoot) this.scrollObserver.unobserve(this.scrollRoot)  // Unobserve current scrollRoot
      if (this.$children.length && this.next !== null) {
        this.scrollRoot = this.$children[this.$children.length - 1].$el  // Change scrollRoot to last element
        this.scrollObserver.observe(this.scrollRoot)  // Observe new scrollRoot
      }
    }
  }
}
