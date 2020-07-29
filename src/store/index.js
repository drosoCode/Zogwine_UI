import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseURL: 'http://192.168.1.64:8083',
    appName: 'Zogwine',
    token: localStorage.getItem('zogwine-token') || null,
    userData: [],
    darkMode: null
  },
  getters: {
    imageEndpoint: state => {
      return state.baseURL
    },
    token: state => {
      return state.token
    },
    isAuthenticated: state => {
      if (state.token !== null) {
        return true
      } else {
        return false
      }
    },
    isAdmin: (getters) => {
      if (getters.userData.admin === 1) {
        return true
      } else {
        return false
      }
    },
    userData: (state, getters) => {
      if (getters.isAuthenticated) {
        if (state.userData.length === 0) {
          axios.get(state.baseURL + '/api/users/data?token=' + state.token)
            .then((response) => {
              state.userData = response.data
            }).catch(() => {})
        }
        return state.userData
      }
    },
    username: (state, getters) => {
      if (getters.isAuthenticated) {
        return getters.userData.name
      } else {
        return null
      }
    },
    darkMode: (state) => {
      if (state.darkMode === null) {
        if (localStorage.getItem('zogwine-dark') !== null) {
          if (localStorage.getItem('zogwine-dark') === 'true') {
            state.darkMode = true
          } else {
            state.darkMode = false
          }
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          state.darkMode = true
        } else {
          state.darkMode = false
        }
        localStorage.setItem('zogwine-dark', state.darkMode)
      }
      return state.darkMode
    }
  },
  actions: {
    login ({ state }, auth) {
      return new Promise((resolve) => {
        axios.get(state.baseURL + '/api/users/authenticate?user=' + auth[0] + '&password=' + auth[1])
          .then((response) => {
            state.token = response.data.response
            if (auth[2]) {
              localStorage.setItem('zogwine-token', state.token)
            }
            localStorage.setItem('zogwine-user', auth[0])
            resolve(true)
          }).catch(() => {
            state.token = null
            resolve(false)
          })
      })
    },
    logout ({ state }) {
      return new Promise((resolve) => {
        state.token = null
        state.isAdmin = false
        state.userData = []
        localStorage.removeItem('zogwine-token')
        resolve(true)
      })
    },
    darkMode ({ state }, status) {
      return new Promise((resolve) => {
        state.darkMode = status
        localStorage.setItem('zogwine-dark', status)
        resolve(true)
      })
    }
  }
})
