export default {
  methods: {
    getLowercaseUrlPathname(url) {
      const urlObject = new URL(url)
      return urlObject.pathname.toLowerCase()
    },
    checkUrlEndsWithExt(url, exts) {
      const pathname = this.getLowercaseUrlPathname(url)
      if (typeof exts === "string") {
        return pathname.endsWith(exts)
      } else if (typeof exts === "object" && Array.isArray(exts)) {
        return exts.find(ext => pathname.endsWith(ext))
      }
    },
    checkUrlIsVideo(url) {
      return this.checkUrlEndsWithExt(url, [".mp4", ".mov"])
    },
    checkUrlIsImage(url) {
      return this.checkUrlEndsWithExt(url, [".webp", ".jpg", ".png", ".jpeg"])
    }
  }
}
