
export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      // { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { hid: 'description' , name: 'description' , content: 'A place for the dankest memes and funniest content. Run your own meme page for your friends, or join existing communities and discover much more!' },
      { hid: 'keywords', name: 'keywords', content: 'Meme,Memes,Funny,Dank,Page,Posts' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css', integrity: 'sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk', crossorigin: 'anonymous' }
    ],
    script: [
      { src: 'https://code.jquery.com/jquery-3.5.1.slim.min.js', integrity: 'sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj', crossorigin: 'anonymous' },
      { src: 'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js', integrity: 'sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo', crossorigin: 'anonymous' },
      { src: 'https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js', integrity: 'sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI', crossorigin: 'anonymous' },
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: 'green', height: '3px' },
  /*
  ** Global CSS
  */
  css: [
    '@fortawesome/fontawesome-svg-core/styles.css',
    '~/assets/styles.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/fontawesome.js',
    '~/plugins/successToast.js',
    '~/plugins/errorToast.js',
    '~/plugins/displayError.js',
    '~/plugins/axios.js',
    '~/plugins/auth.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/toast'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: "http://127.0.0.1:8000",
    progress: false
  },
  /*
  ** Auth module configuration
  */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/api/token/', method: 'post', propertyName: 'access' },
          logout: false,
          // logout: { url: '/api/auth/logout/', method: 'post' },
          user: { url: '/api/auth/user/', method: 'get', propertyName: false, progress: false }
        },
        tokenType: 'Bearer'
      }
    },
    redirect: {
      login: false,
      logout: '/',
      callback: false,
      home: '/feed' // If using 'auth' middleware, then must be false
    },
    localStorage: false
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
