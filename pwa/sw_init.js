if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/sw_content.js', { scope: '/' }).then(reg => {
    reg.onupdatefound = () => {
      const installingWorker = reg.installing
      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // new update available
            this.$q.notify({
              message: 'Updating application ...',
              icon: 'sync',
              position: 'bottom-left',
              color: 'light-blue'
            })

            caches.keys().then(function (keyList) {
              return Promise.all(keyList.map(function (key) {
                return caches.delete(key)
              })).then(function () {
                window.location.reload(true)
              })
            })
          }
        }
      }
    }
  }).catch(err => console.error('[SW ERROR]', err))
}
