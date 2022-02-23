export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'REQUESTBIN',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  publicRuntimeConfig: {
    apiBaseURL: process.env.apiBaseURL,
    apiProxyURL: process.env.apiProxyURL,
    universal: {
      pageSize: 10
    }
  },
  privateRuntimeConfig: {},

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~/assets/css/prettify.css',
    '~/assets/css/font-awesome-ie7.min.css',
    '~/assets/css/font-awesome.min.css',
    '~/assets/css/responsive.css',
    '~/assets/css/styles.css',
    'jsoneditor/dist/jsoneditor.min.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/dotenv'
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    'bootstrap-vue/nuxt'
  ],

  pwa: {
    icon: {
      source: './static/icon.png'
    },
    manifest: {
      name: 'REQUESTBIN',
      short_name: 'BIN',
      lang: 'en',
      display: 'standalone',
      description: 'Request Bin App'
    }
  },

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseUrl: process.env.baseUrl,
    browserBaseURL: process.env.baseUrl,
    proxy: true,
    proxyHeaders: true,
    withCredentials: true
  },

  /*
  ** Proxy configuration
  ** See https://axios.nuxtjs.org/options#proxy
  */
  proxy: {
    // Server-side proxy handler
    '/api/': {
      target: process.env.apiProxyURL,
      pathRewrite: { '^/api/': '' }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
