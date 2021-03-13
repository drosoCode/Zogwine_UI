<template>
    <div></div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'mediaSession',
  data () {
    return {
      data: {},
      data2: {},
      people: [],
      supported: false,
      actionHandlers: [
        ['play', () => { this.$emit('play') }],
        ['pause', () => { this.$emit('pause') }],
        ['stop', () => { this.$emit('stop'); this.stop() }],
        ['seekto', (details) => { if (!details.fastSeek) { this.$emit('seek', details.seekTime) } }]
      ]
    }
  },
  mounted () {
    if ('mediaSession' in navigator) {
      this.supported = true
      this.loadData()
    }
  },
  methods: {
    loadData: function () {
      const mediaType = parseInt(this.mediaType)
      if (mediaType === 1) {
        // tvs episode
        this.$apiCall('tvs/episode/' + this.mediaData)
          .then((response) => {
            this.data = response
            this.$apiCall('tvs/' + response.idShow)
              .then((resp) => {
                this.data2 = resp
                this.$apiCall('person/2/' + this.data.idShow)
                  .then((resp) => {
                    this.people = resp
                    this.loadMediaSession()
                  })
              })
          })
      } else if (mediaType === 2) {
        // tvs
        this.$apiCall('tvs/' + this.mediaData)
          .then((response) => {
            this.data = response
            this.$apiCall('person/' + this.mediaType + '/' + this.mediaData)
              .then((resp) => {
                this.people = resp
                this.loadMediaSession()
              })
          })
      } else if (mediaType === 3) {
        // movie
        this.$apiCall('movie/' + this.mediaData)
          .then((response) => {
            this.data = response
            this.$apiCall('person/' + this.mediaType + '/' + this.mediaData)
              .then((resp) => {
                this.people = resp
                this.loadMediaSession()
              })
          })
      }
    },
    stop: function () {
      if (this.supported) {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: '',
          artist: '',
          album: '',
          artwork: []
        })
        for (const [action] of this.actionHandlers) {
          try {
            navigator.mediaSession.setActionHandler(action, null)
          } catch (error) { }
        }
        navigator.mediaSession.setPositionState(null)
      }
    },
    loadMediaSession: function () {
      if (this.supported) {
        let title = this.data.title
        if (parseInt(this.mediaType) === 1) {
          title += ' (E' + this.data.episode + ')'
        }
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: title,
          artist: this.artist,
          album: this.album,
          artwork: [
            { src: this.data.icon, type: 'image/png' }
          ]
        })

        navigator.mediaSession.playbackState = this.playbackState
        this.setPosition()
        for (const [action, handler] of this.actionHandlers) {
          try {
            navigator.mediaSession.setActionHandler(action, handler)
          } catch (error) {
            console.log(`The media session action "${action}" is not supported yet.`)
          }
        }
      }
    },
    setPosition: function () {
      if (this.supported && this.position >= 0 && this.duration > 0 && this.duration >= this.position) {
        navigator.mediaSession.setPositionState({
          duration: this.duration,
          playbackRate: 1,
          position: this.position
        })
      }
    }
  },
  computed: {
    album: function () {
      if (this.data2.title !== undefined) {
        return this.data2.title
      } else {
        return ''
      }
    },
    artist: function () {
      let ret = ''
      this.people.forEach(el => {
        if (el.known_for.toLowerCase() === 'writing' && (parseInt(this.mediaType) === 1 || parseInt(this.mediaType) === 2)) {
          ret = el.name
        } else if (el.known_for.toLowerCase() === 'production' && parseInt(this.mediaType) === 3) {
          ret = el.name
        }
      })
      return ret
    },
    playbackState: function () {
      if (this.status === 2) {
        return 'playing'
      } else if (this.status === 1) {
        return 'paused'
      } else {
        this.stop()
        return 'playing'
      }
    }
  },
  beforeDestroy: function () {
    this.stop()
  },
  watch: {
    status: function (oldVal, newVal) {
      if (this.supported) {
        if (oldVal === 0) {
          this.loadData()
        } else if (newVal === 0) {
          this.stop()
        } else {
          navigator.mediaSession.playbackState = this.playbackState
        }
      }
    },
    position: function () {
      this.setPosition()
    },
    mediaData: function () {
      this.stop()
      this.loadData()
    }
  },
  props: {
    mediaType: {
      required: true
    },
    mediaData: {
      required: true
    },
    status: {
      required: false,
      default: 2
    },
    position: {
      required: false,
      default: -1
    },
    duration: {
      required: false,
      default: -1
    }
  }
})
</script>
