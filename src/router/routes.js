import store from '../store/index.js'

const isAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
  } else {
    next({ name: 'login', query: { redirect: to.path } })
  }
}

const goLogin = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next()
  } else {
    next('/')
  }
}

const goSettings = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    if (store.getters.isAdmin) {
      next()
    } else {
      next('/')
    }
  } else {
    next('/login')
  }
}

const goDevices = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    if (store.getters.cast) {
      next()
    } else {
      next('/')
    }
  } else {
    next('/login')
  }
}

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import('pages/home/Main.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/movie',
    name: 'movies',
    component: () => import('pages/movies/Main.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/movie/:id',
    name: 'movie',
    component: () => import('pages/movies/Item.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/movie/c/:id',
    name: 'movie_collection',
    component: () => import('pages/movies/Collection.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/tvshow',
    name: 'tvshows',
    component: () => import('pages/tvs/Main.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/tvshow/:id',
    name: 'tvshow',
    component: () => import('pages/tvs/Item.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/tvshow/:id/:season',
    name: 'season',
    component: () => import('pages/tvs/Season.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/tvshow/:id/:season/:episode',
    name: 'episode',
    component: () => import('pages/tvs/Season.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/music',
    name: 'music',
    component: () => import('pages/Error404.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/games',
    name: 'games',
    component: () => import('pages/Error404.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/books',
    name: 'books',
    component: () => import('pages/Error404.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/mangas',
    name: 'mangas',
    component: () => import('pages/Error404.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/devices',
    name: 'devices',
    component: () => import('pages/devices/Main.vue'),
    beforeEnter: goDevices
  },
  {
    path: '/player',
    name: 'player',
    component: () => import('pages/player/Main.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/player/remote/:device',
    name: 'remote',
    component: () => import('pages/player/Remote.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/player/:mediaType/:data',
    name: 'playItem',
    component: () => import('pages/player/Item.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('pages/search/Main.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/search/result',
    name: 'search_result',
    component: () => import('pages/search/Results.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('pages/settings/Main.vue'),
    beforeEnter: goSettings
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/auth/login.vue'),
    beforeEnter: goLogin
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
    beforeEnter: isAuthenticated
  }
]

export default routes
