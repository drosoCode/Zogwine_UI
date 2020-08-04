import store from '../store/index.js'

const isAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    next()
  } else {
    next('/login')
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

const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import('pages/home/Main.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/movies',
    name: 'movies',
    component: () => import('pages/Error404.vue'),
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
    component: () => import('pages/Error404.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/player',
    name: 'player',
    component: () => import('pages/player/Main.vue'),
    beforeEnter: isAuthenticated
  },
  {
    path: '/player/:mediaType/:data',
    name: 'playItem',
    component: () => import('pages/player/Item.vue'),
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
