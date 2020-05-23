export default {
  data() {
    return {
      lazyObjectObserver: new IntersectionObserver(this.lazyLoad, {rootMargin: "100px 0px"}),
    }
  },
  methods: {
    lazyLoad(entries, observer) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target
          if (el.tagName === "VIDEO") {
            el.onloadeddata = () => {
              // Video sometimes doesn't play if it is the first meme at top of page due to AbortError
              if (entry.intersectionRatio > 0.9) el.play()
            }
            el.firstChild.src = el.firstChild.dataset.src
            el.firstChild.removeAttribute("data-src")
            el.load()
          } else if (el.tagName === "IMG") {
            el.onload = () => {
              el.classList.add("faded-in")
            }
            if (el.dataset.srcset) {
              el.srcset = el.dataset.srcset
              el.removeAttribute("data-srcset")
            }
            el.src = el.dataset.src
            el.removeAttribute("data-src")
          }
          observer.unobserve(el)
        }
      })
    }
  }
}
