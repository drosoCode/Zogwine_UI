<template>
    <div class="remotePlayer">
        <videoPlayer v-if="status !== 0" @time="updatePosition" @status="updateStatus" :status="status" :position="position" :startPlayer="true" :showNext="false" :mediaType="mediaType" :mediaData="mediaData" :audioStreamSetup="audioStreamSetup" :subStreamSetup="subStreamSetup" :subFileSetup="subFileSetup" :resizeSetup="resizeSetup" :remove3dSetup="remove3dSetup" />
        <q-card class="row justify-center items-center text-white" style="background: radial-gradient(circle, #fc4e42 0%, #850000 100%); width: 30rem; height:20rem;" v-else>
        <q-card-section>
            <div class="text-h6" v-if="connection == -1">Connection Failed</div>
            <div class="text-h6" v-if="connection == 0">Connecting ...</div>
            <div class="text-h6" v-if="connection == 1">Waiting for media</div>
            <div class="text-subtitle2">Press escape to exit fullscreen</div>
        </q-card-section>
        </q-card>
        <mediaSession v-if="mediaType !== -1" :mediaType="mediaType" :mediaData="mediaData" :status="status" :position="position" @play="status = 2" @pause="status = 1" @stop="status = 0" @seek="(val) => { this.position = val }" />
    </div>
</template>

<style>
.remotePlayer .video-js {
  width: 100vw !important;
  height: 100vh !important;
}
</style>

<script>
import io from 'socket.io-client'
import { defineComponent } from '@vue/composition-api'
import videoPlayer from './videoPlayer'
import mediaSession from './mediaSession'

export default defineComponent({
  name: 'remotePlayer',
  components: { videoPlayer, mediaSession },
  data () {
    return {
      connection: 0,
      status: 0,
      socket: null,
      position: 0,
      mediaType: -1,
      mediaData: '',
      audioStreamSetup: undefined,
      subStreamSetup: undefined,
      subFileSetup: undefined,
      resizeSetup: undefined,
      remove3dSetup: undefined,
      lastTime: 0
    }
  },
  methods: {
    updateStatus: function (value) {
      this.socket.emit('remote_player', {
        type: 'status',
        action: 'status',
        data: value,
        name: this.name
      })
    },
    updatePosition: function (value) {
      value = Math.floor(value)
      if (value !== this.lastTime) {
        this.socket.emit('remote_player', {
          type: 'status',
          action: 'position',
          data: value,
          name: this.name
        })
        this.lastTime = value
      }
    },
    playMedia: function (data) {
      this.mediaType = data.mediaType
      this.mediaData = data.mediaData
      if (data.audioStream !== undefined) {
        this.audioStreamSetup = data.audioStream
      }
      if (data.subStream !== undefined) {
        this.subStreamSetup = data.subStream
      }
      if (data.subFile !== undefined) {
        this.subFileSetup = data.subFile
      }
      if (data.resize !== undefined) {
        this.resizeSetup = data.resize
      }
      if (data.remove3d !== undefined) {
        this.remove3dSetup = data.remove3d
      }
      if (data.startFrom !== undefined) {
        this.position = data.startFrom
      }
      this.status = 2
    }
  },
  mounted () {
    document.querySelector('body').style.overflow = 'hidden'

    this.socket = io(this.$store.getters.socketioEndpoint)

    this.socket.on('authentication', (data) => {
      const d = JSON.parse(data)
      if (d.data === 'ok') {
        this.socket.emit('remote_player', {
          type: 'action',
          action: 'connect',
          name: this.name
        })
      } else {
        this.connection = -1
      }
    })

    this.socket.on('remote_player', (data) => {
      const d = JSON.parse(data)
      if (d.type === 'status' && d.action === 'connect') {
        this.connection = 1
      } else if (d.action === 'playMedia') {
        this.playMedia(d.data)
      } else if (d.action === 'play') {
        this.status = 2
      } else if (d.action === 'pause') {
        this.status = 1
      } else if (d.action === 'stop') {
        this.status = 0
      } else if (d.action === 'seek') {
        this.position = d.data
      }
    })

    this.socket.emit('authentication', {
      type: 'action',
      action: 'login',
      data: this.$store.getters.token
    })
  },
  watch: {
    status: function (val) {
      if (val !== 0 && this.$store.getters.showNavigation) {
        this.$store.dispatch('showNavigation', false)
      } else if (val === 0 && !this.$store.getters.showNavigation) {
        this.$store.dispatch('showNavigation', true)
      }
    }
  },
  beforeDestroy: function () {
    document.querySelector('body').style.removeProperty('overflow')
  },
  props: {
    name: {
      required: false,
      default: 'self'
    }
  }
})
</script>
