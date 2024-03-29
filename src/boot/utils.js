
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
}
