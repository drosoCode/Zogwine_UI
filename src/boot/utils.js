
export default ({ Vue, store, router }) => {
  Vue.prototype.$getTagIcon = function (name) {
    if (name === 'genre') {
      return 'leaderboard'
    } else if (name === 'network') {
      return 'wifi_tethering'
    } else if (name === 'country') {
      return 'flag'
    } else if (name === 'production') {
      return 'widgets'
    } else {
      return 'close'
    }
  }

  Vue.prototype.$getImageLink = function (img) {
    if (img === undefined || img === null) {
      return img
    }
    if (img.substring(0, 4) === 'http') {
      return img
    } else {
      console.log(img)
      return this.$store.getters.imageEndpoint + img
    }
  }

  Vue.prototype.$formatDate = function (date) {
    return new Date(date * 1000).toISOString().split('T')[0]
  }
}
