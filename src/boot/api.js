import axios from 'axios'
import { Notify } from 'quasar'

export default ({ Vue, store, router }) => {
  Vue.prototype.$apiCall = function (data) {
    return new Promise((resolve) => {
      let url = store.state.baseURL + '/api/' + data
      if (data.includes('?')) {
        url += '&token=' + store.getters.token
      } else {
        url += '?token=' + store.getters.token
      }

      axios.get(url)
        .then((response) => {
          resolve(response.data)
        }).catch((error) => {
          if (error.response.status === 401) {
            Notify.create({
              message: 'Not Authenticated',
              icon: 'mdi-alert',
              position: 'bottom-left',
              color: 'red'
            })
            store.dispatch('logout').then(() => {
              router.push('/login')
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
        })
    })
  }
}
