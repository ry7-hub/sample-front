module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'sample-front',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/vuetify',
    ['@nuxtjs/moment', ['ja']],
    '@nuxtjs/proxy'
  ],
  vuetify: {
    // Vuetify の設定はここに書く
    theme: {
      primary: '#3f51b5',
      secondary: '#b0bec5',
      accent: '#8c9eff',
      error: '#b71c1c'
    }
  },
  axios: {
    // baseURL: 'http://localhost:8081'
    baseURL: 'http://ec2-13-115-246-181.ap-northeast-1.compute.amazonaws.com:8081',
    credentials: true,
    proxy: true
  },

  proxy: {
    '/api': {
      target: 'http://172.30.0.2:8081',
      headers: { 'X-Forwarded-Host': '172.30.0.10:3000' }
    }
  },

  auth: {
    redirect: {
      login: '/login',   // 未ログイン時に認証ルートへアクセスした際のリダイレクトURL
      logout: '/login',  // ログアウト時のリダイレクトURL
      callback: false,   // Oauth認証等で必要となる コールバックルート
      home: '/',         // ログイン後のリダイレクトURL
    },
    strategies: {
      local: {
        endpoints: {
          // login: { url: 'authenticate', method: 'post', propertyName: 'token' },
          // user: { url: 'me', method: 'get',propertyName: ''},
          // logout: false
          login: { url: '/api/auth/login', method: 'post', propertyName: 'token' },
          logout: false,
          user: { url: '/api/auth/user', method: 'get', propertyName: '' }
        }
      }
    }
  }
}
