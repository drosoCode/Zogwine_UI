<template>
    <div class="q-px-md q-pt-md col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2">
        <q-card class="dev_card">
            <q-img :src="'/images/'+$attrs.type+'.png'" class="dev_img" />
              <q-linear-progress :value="playedPercent" :color="barColor" />

            <q-card-section>
                <div class="row no-wrap items-center justify-between text-h5">
                    {{ $attrs.name }} | {{ $attrs.type }}
                    <div>
                        <q-chip square color="teal" text-color="white" icon="done" v-if="$attrs.enabled && $attrs.available">
                          Online
                        </q-chip>
                        <q-chip square color="red" text-color="white" icon="clear" v-if="$attrs.enabled && !$attrs.available">
                          Offline
                        </q-chip>
                        <q-chip square color="grey-8" text-color="white" icon="block" v-if="!$attrs.enabled">
                          Disabled
                        </q-chip>
                    </div>
                </div>
            </q-card-section>

            <q-card-section class="q-pt-none" v-if="$attrs.enabled && $attrs.available">
                <div class="text-subtitle1">
                  <span v-if="playingMediaTitle !== null"> {{ playingMediaTitle }} | </span> {{ statusLabel }}
                </div>
            </q-card-section>

            <q-separator v-if="$attrs.enabled && $attrs.available && this.status !== 0 && this.status !== null" />
            <q-card-actions align="right" v-if="$attrs.enabled && $attrs.available && this.status !== 0 && this.status !== null" class="col">
                <q-btn flat round color="teal" icon="play_arrow" v-if="functions.includes('play') && this.status === 1" @click="callDeviceFunction('play')"/>
                <q-btn flat round color="orange" icon="pause" v-if="functions.includes('pause') && this.status === 2" @click="callDeviceFunction('pause')"/>
                <q-btn flat round color="red" icon="stop" v-if="functions.includes('stop') && this.status !== 0 && this.status !== null" @click="callDeviceFunction('stop')" />
                <router-link :to="{ name: 'remote', params: { device: $attrs.id } }" v-if="this.status !== 0 && this.status !== null">
                  <q-btn flat round color="white" icon="games" />
                </router-link>
            </q-card-actions>
        </q-card>
    </div>
</template>

<style scoped>
.body--dark .dev_card:hover {
    box-shadow: 6px 10px #000000;
}
.dev_img {
  height: 100%;
  width: 100%;
  max-height: 10rem;
}
</style>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'deviceCard',
  data () {
    return {
      functions: [],
      status: null,
      position: null,
      duration: null,
      playingMedia: { mediaType: -1, mediaData: '' },
      playingMediaTitle: null,
      lengthOverride: false,
      interval: null
    }
  },
  methods: {
    updateStatus: function () {
      if (this.functions.includes('status')) {
        this.$apiCall('device/' + this.$attrs.id + '/function/status')
          .then((response) => {
            this.status = response

            if (this.functions.includes('position') && this.status > 0) {
              this.$apiCall('device/' + this.$attrs.id + '/function/position')
                .then((response) => {
                  this.position = response
                })
            }
            if (this.functions.includes('playingMedia') && this.status > 0) {
              this.$apiCall('device/' + this.$attrs.id + '/function/playingMedia')
                .then((resp) => {
                  if (resp.mediaType !== this.playingMedia.mediaType && resp.mediaData !== this.playingMedia.mediaData) {
                    this.playingMedia.mediaType = resp.mediaType
                    this.playingMedia.mediaData = resp.mediaData
                    this.getMediaData()
                  }
                })
            }
          })
      }
    },
    getMediaData: function () {
      if (this.playingMedia.mediaType === 1) {
        this.$apiCall('tvs/episode/' + this.playingMedia.mediaData)
          .then((resp) => {
            this.playingMediaTitle = resp.title + ' (Episode)'
          })
      } else if (this.playingMedia.mediaType === 2) {
        this.$apiCall('tvs/' + this.playingMedia.mediaData)
          .then((resp) => {
            this.playingMediaTitle = resp.title + ' (TV Show)'
          })
      } else if (this.playingMedia.mediaType === 3) {
        this.$apiCall('movie/' + this.playingMedia.mediaData)
          .then((resp) => {
            this.playingMediaTitle = resp.title + ' (Movie)'
          })
      }

      this.$apiCall('player/property?mediaType=' + this.playingMedia.mediaType + '&mediaData=' + this.playingMedia.mediaData)
        .then((resp) => {
          this.duration = resp.duration
        })
    },
    callDeviceFunction: function (name) {
      if (name === 'play') {
        this.status = 2
      } else if (name === 'pause') {
        this.status = 1
      } else if (name === 'stop') {
        this.status = 0
      }
      this.$apiCall('device/' + this.$attrs.id + '/function/' + name)
        .then((response) => {})
    }
  },
  computed: {
    playedPercent: function () {
      if (this.$attrs.enabled === 1 && this.$attrs.available === true && this.position !== null && this.duration !== null) {
        return this.position / this.duration
      } else {
        return 100
      }
    },
    barColor: function () {
      if (!this.$attrs.available) {
        return 'red'
      }
      if (!this.$attrs.enabled) {
        return 'grey-8'
      }
      if (this.status === 2) {
        return 'teal'
      } else if (this.status === 1) {
        return 'orange'
      } else {
        return 'red'
      }
    },
    statusLabel: function () {
      if (this.status === 0) {
        return 'STOPPED'
      } else if (this.status === 1) {
        return 'PAUSED'
      } else if (this.status === 2) {
        return 'PLAYING'
      } else {
        return 'UNKNOWN'
      }
    }
  },
  mounted () {
    this.$apiCall('device/' + this.$attrs.id + '/function')
      .then((response) => {
        this.functions = response
        if (this.$attrs.enabled && this.$attrs.available) {
          this.updateStatus()
          this.interval = setInterval(() => { this.updateStatus() }, 10000)
        }
      })
  },
  beforeDestroy: function () {
    if (this.interval != null) {
      clearInterval(this.interval)
    }
  },
  props: [{
    id: {
      required: true
    },
    name: {
      required: true
    },
    type: {
      required: true
    },
    available: {
      required: true
    },
    enabled: {
      required: true
    }
  }]
})
</script>
