import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseURL: 'http://10.10.2.1:8083',
    // baseURL: '',
    appName: 'Zogwine',
    token: localStorage.getItem('zogwine-token') || null,
    userData: [],
    darkMode: null
  },
  getters: {
    imageEndpoint: state => {
      return state.baseURL
    },
    apiEndpoint: state => {
      return state.baseURL + '/api/'
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
    cast: (getters) => {
      if (getters.userData.cast === 1) {
        return true
      } else {
        return false
      }
    },
    userData: (state, getters) => {
      if (getters.isAuthenticated) {
        if (state.userData.length === 0) {
          axios({
            headers: {
              'content-type': 'application/json',
              Authorization: 'Bearer ' + state.token
            },
            url: state.baseURL + '/api/user/data',
            method: 'GET'
          })
            .then((response) => {
              state.userData = response.data.data
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
        axios.get(state.baseURL + '/api/user/signin?user=' + auth[0] + '&password=' + auth[1])
          .then((response) => {
            state.token = response.data.data
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
        axios({
          headers: {
            'content-type': 'application/json',
            Authorization: 'Bearer ' + state.token
          },
          url: state.baseURL + '/api/user/signout',
          method: 'GET'
        })
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
