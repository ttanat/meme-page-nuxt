export default {
  data() {
    return {
      autoplayObserver: new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const video = this.$children.find(child => child.$refs.memeEl === entry.target)
          if (video) video.togglePlayback(entry.intersectionRatio > 0.9)
        })
      }, {threshold: [0.1, 0.9]})
    }
  }
}
