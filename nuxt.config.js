export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'DAPP',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    // STYLESHEET SCRIPTS
    link: [
      {
        rel: 'stylesheet',

        href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i',
      },
      { rel: 'icon', type: 'image/x-icon', href: '/img/favicon.png' },
      {
        rel: 'stylesheet',
        href: '/vendor/bootstrap/css/bootstrap.min.css',
      },
      {
        rel: 'stylesheet',
        href: '/vendor/remixicon/remixicon.css',
      },
      {
        rel: 'stylesheet',
        href: 'vendor/bootstrap-icons/bootstrap-icons.css',
      },
      {
        rel: 'stylesheet',
        href: '/vendor/swiper/swiper-bundle.min.css',
      },
      {
        rel: 'stylesheet',
        href: '/vendor/glightbox/css/glightbox.min.css',
      },
      {
        rel: 'stylesheet',
        href: '/css/style.css',
      },
    ],

    // JAVASCRIPT SCRIPTS
    script: [
      {
        src: 'vendor/bootstrap/js/bootstrap.bundle.min.js',
        ssr: false,
        body: true,
      },
      {
        src: '/vendor/aos/aos.js',
        ssr: false,
        body: true,
      },
      {
        src: '/vendor/swiper/swiper-bundle.min.js',
        ssr: false,
        body: true,
      },
      {
        src: '/vendor/purecounter/purecounter.js',
        ssr: false,
        body: true,
      },
      {
        src: '/vendor/isotope-layout/isotope.pkgd.min.js',
        ssr: false,
        body: true,
      },
      {
        src: '/vendor/glightbox/js/glightbox.min.js',
        ssr: false,
        body: true,
      },
      {
        src: '/js/main.js',
        ssr: false,
        body: true,
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    ["bootstrap-vue/nuxt"],
    // '@nuxtjs/axios',
  ],
  // bootstrapVue: {
  //   bootstrapCSS: false,
  //   bootstrapVueCSS: false
  // },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
