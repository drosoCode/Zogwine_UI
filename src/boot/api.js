import axios from 'axios'
import { Notify } from 'quasar'

export default ({ Vue, store, router }) => {
  Vue.prototype.$apiCall = function (endpoint, data = null, method = 'GET', displayErrors = true) {
    return new Promise((resolve) => {
      const url = store.state.baseURL + '/api/' + endpoint
      axios({
        method: method,
        url: url,
        data: data,
        headers: {
          'content-type': 'application/json',
          Authorization: 'Bearer ' + store.getters.token
        }
      }).then((response) => {
        resolve(response.data.data)
      }).catch((error) => {
        if (displayErrors) {
          if (error.response.status === 401) {
            Notify.create({
              message: 'Not Authenticated',
              icon: 'mdi-alert',
              position: 'bottom-left',
              color: 'red'
            })
            store.dispatch('logout').then(() => {
              let route = '/'
              try {
                route = this.$route.currentRoute.path
              } catch {}
              router.push({ name: 'login', query: { redirect: route } })
            })
          } else if (error.response.status === 403) {
            Notify.create({
              message: 'Not Authorized',
              icon: 'mdi-alert',
              position: 'bottom-left',
              color: 'red'
            })
            router.push('/')
          } else {
            Notify.create({
              message: 'Network Error',
              icon: 'mdi-alert',
              position: 'bottom-left',
              color: 'red'
            })
          }
          resolve(null)
        } else {
          Promise.reject(error)
        }
      })
    })
  }
}
