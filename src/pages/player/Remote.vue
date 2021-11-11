<template>
  <q-page>
    <div v-if="status !== 0">
      <div class="row wrap justify-around" v-if="mediaType !== -1">
        <mediaCard :mediaType="mediaType" :mediaData="mediaData" class="q-px-md q-pt-md col-xs-12 col-sm-12 col-md-10 col-lg-8 col-xl-6 noPadding"/>
    </div>
      <div class="row wrap justify-around">
        <q-card class="q-mt-md col-xs-12 col-sm-12 col-md-10 col-lg-8 col-xl-6 noPadding">
          <q-card-section class="row justify-around">
              <div class="row wrap">
                  <q-btn size="xl" color="primary" icon="play_arrow" class="col q-mx-md" :disable="status !== 1" v-if="deviceFunctions.includes('play')" @click="callDeviceFunction('play')"/>
                  <q-btn size="xl" color="primary" icon="pause" class="col q-mx-md" :disable="status !== 2" v-if="deviceFunctions.includes('pause')" @click="callDeviceFunction('pause')"/>
                  <q-btn size="xl" color="primary" icon="stop" class="col q-mx-md" :disable="status === 0" v-if="deviceFunctions.includes('stop')" @click="callDeviceFunction('stop')"/>
                  <q-btn size="xl" color="primary" icon="volume_up" class="col q-mx-md" :disable="!muted" v-if="deviceFunctions.includes('unmute')" @click="callDeviceFunction('unmute')"/>
                  <q-btn size="xl" color="primary" icon="volume_off" class="col q-mx-md" :disable="muted" v-if="deviceFunctions.includes('mute')" @click="callDeviceFunction('mute')"/>
              </div>
          </q-card-section>
        </q-card>
    </div>
      <div class="row wrap justify-around">
        <q-card class="q-mt-md col-xs-12 col-sm-12 col-md-10 col-lg-8 col-xl-6 noPadding">
          <q-card-section>
              <q-item v-if="deviceFunctions.includes('setVolume')">
                  <q-item-section side>
                    <q-icon color="primary" name="volume_up" />
                  </q-item-section>
                  <q-item-section>
                    <q-slider
                        v-model="volume"
                        :min="0"
                        :max="100"
                        label
                        color="primary"
                        @change="setVolume"
                    />
                  </q-item-section>
                  <q-item-section side>
                    <q-badge color="primary">{{ volume }}%</q-badge>
                  </q-item-section>
              </q-item>
              <q-item v-if="deviceFunctions.includes('seek')">
                  <q-item-section side>
                    <q-icon color="secondary" name="fast_forward" />
                  </q-item-section>
                  <q-item-section>
                      <customSlider :min="0" :max="duration" :value="progress" @update="seekChange" :buffered="loaded" color="secondary" bufferedColor="green-9"/>
                  </q-item-section>
                  <q-item-section side>
                    <q-badge color="secondary">{{ timeLabel }}</q-badge>
                  </q-item-section>
              </q-item>
          </q-card-section>
        </q-card>
    </div>
    <mediaSession :mediaType="mediaType" :mediaData="mediaData" :status="status" :duration="duration" :position="position" @play="callDeviceFunction('play')" @pause="callDeviceFunction('pause')" @stop="callDeviceFunction('stop')" @seek="(val) => { seekChange(val) }" />
   </div>

    <div class="row justify-center items-center" v-if="mediaType === -1 && status === 0" style="height: 90vh;">
        <q-card class="row justify-center items-center text-white" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%); width: 30rem; height:20rem;">
            <q-card-section>
            <div class="text-h6">Nothing Playing</div>
            </q-card-section>
        </q-card>
    </div>

  </q-page>
</template>

<style scoped>
.noPadding {
    padding: 0px;
    margin: 1%;
}
</style>

<script>
import Vue from 'vue'
import mediaCard from '../components/mediaCard.vue'
import customSlider from './components/customSlider.vue'
import mediaSession from './components/mediaSession.vue'

export default Vue.extend({
  components: { mediaCard, customSlider, mediaSession },
  data () {
    return {
      mediaType: -1,
      mediaData: '',
      deviceInfos: {},
      deviceFunctions: [],
      status: null,
      position: 0,
      loaded: 120,
      duration: 0,
      volume: 50,
      progress: 0,
      muted: false,
      interval: null,
      positionLabel: '0:0'
    }
  },
  mounted () {
    this.$apiCall('device/' + this.$route.params.device)
      .then((response) => {
        this.deviceInfos = response
      })
    this.$apiCall('device/' + this.$route.params.device + '/function')
      .then((response) => {
        this.deviceFunctions = response
        this.updateStatus()
      })
    this.interval = setInterval(() => { this.updateStatus() }, 5000)
  },
  computed: {
    timeLabel: function () {
      return Math.floor(this.progress / 60) + ':' + Math.round(this.progress % 60)
    }
  },
  methods: {
    updateStatus: function () {
      if (this.deviceFunctions.includes('status')) {
        this.$apiCall('device/' + this.$route.params.device + '/function/status')
          .then((response) => {
            this.status = response

            if (this.deviceFunctions.includes('position') && this.status > 0) {
              this.$apiCall('device/' + this.$route.params.device + '/function/position')
                .then((response) => {
                  this.progress = response
                })
            }
            if (this.deviceFunctions.includes('loaded') && this.status > 0) {
              this.$apiCall('device/' + this.$route.params.device + '/function/loaded')
                .then((response) => {
                  this.loaded = response
                })
            }
            if (this.deviceFunctions.includes('playingMedia') && this.status > 0) {
              this.$apiCall('device/' + this.$route.params.device + '/function/playingMedia')
                .then((response) => {
                  if (response.mediaType !== this.mediaType && response.mediaData !== this.mediaData) {
                    this.$apiCall('player/property/' + response.mediaType + '/' + response.mediaData)
                      .then((resp) => {
                        this.duration = resp.duration
                      })
                  }
                  this.mediaType = response.mediaType
                  this.mediaData = response.mediaData
                })
            }
          })
      }
    },
    seekChange: function (value) {
      this.progress = value
      this.$apiCall('device/' + this.$route.params.device + '/function/seek?value=' + value)
        .then((response) => {})
    },
    setVolume: function () {
      this.$apiCall('device/' + this.$route.params.device + '/function/setVolume?value=' + this.volume)
        .then((response) => {})
    },
    callDeviceFunction: function (name) {
      if (name === 'play') {
        this.status = 2
      } else if (name === 'pause') {
        this.status = 1
      } else if (name === 'stop') {
        this.status = 0
      } else if (name === 'mute') {
        this.muted = true
      } else if (name === 'unmute') {
        this.muted = false
      } else {
        return
      }
      this.$apiCall('device/' + this.$route.params.device + '/function/' + name)
        .then((response) => {
          if (this.status === 0) {
            this.$router.push({ name: 'player' })
          }
        })
    }
  },
  beforeDestroy: function () {
    if (this.interval != null) {
      clearInterval(this.interval)
    }
  }
})
</script>
