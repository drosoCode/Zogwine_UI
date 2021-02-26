<template>
    <div>
        <div v-if="!playing">
            <q-chip square color="primary" text-color="white" icon="local_fire_department">Codec: {{ fileInfos.video_codec }}</q-chip>
            <q-chip square color="primary" text-color="white" icon="camera">Format: {{ fileInfos.format }}</q-chip>
            <q-chip square color="primary" text-color="white" icon="access_time">Duration: {{ duration }} min</q-chip>
            <q-chip square color="orange" text-color="white" icon="fiber_smart_record" v-if="this.fileInfos.stereo3d > 0">3D</q-chip>
            <br>
            <q-select v-model="audioStreamValue" :options="audioStream" label="Audio Stream">
                <template v-slot:prepend>
                    <q-icon name="audiotrack" />
                </template>
            </q-select>
            <br>
            <q-select v-model="subStreamValue" :options="subStream" label="Subtitles Stream">
                <template v-slot:prepend>
                    <q-icon name="subtitles" />
                </template>
            </q-select>
            <br>
            <q-select v-model="resizeValue" :options="resize" label="Resize">
                <template v-slot:prepend>
                    <q-icon name="photo_size_select_large" />
                </template>
            </q-select>
            <br>
            <q-select v-model="remove3dValue" :options="remove3D" label="Remove 3D" v-if="mediaType == 3">
                <template v-slot:prepend>
                    <q-icon name="broken_image" />
                </template>
            </q-select>
            <br>
            <q-slider
                v-model="startFromValue"
                :min="0"
                :max="fileInfos.duration"
                :step="1"
                label
                color="teal"
                :label-value="sliderLabelValue"
            />
            <br>
            <q-btn-dropdown
              split
              class="full-width"
              color="teal"
              label="Play"
              icon="play_arrow"
              @click="playNativeVideo"
            >
              <q-list>
                <q-item clickable v-close-popup @click="playVideo(-1)">
                  <q-item-section avatar>
                    <q-avatar icon="blur_linear" color="secondary" text-color="white" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Force Transcoding</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="playVideo(-1, true)">
                  <q-item-section avatar>
                    <q-avatar icon="blur_on" color="secondary" text-color="white" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Force Transcoding with subs</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="playVideo(dev.id)" v-for="dev in devices" :key="dev.id">
                  <q-item-section avatar>
                    <q-avatar icon="cast" color="secondary" text-color="white" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ dev.name }}</q-item-label>
                    <q-item-label caption>{{ dev.type }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
        </div>

        <div :hidden="loading || !playing">
            <div ref="videoPlayerContainer"></div>
            <div class="row">
              <customSlider :min="0" :max="fileInfos.duration" :value="customSeekValue" @update="seekChange" :buffered="customSeekBuffer" class="col-12 col-lg-11" v-if="customSeekValue >= 0"></customSlider>
              <div class="col-12 col-lg-1">
                &nbsp;
                <q-btn class="q-mt-sm" color="primary" label="Next" icon="skip_next" size="xs" v-if="nextEpisode !== -1 && nextEpisode !== mediaData" @click="skipEpisode"/>
              </div>
            </div>
        </div>

        <div v-if="loading">
            <h1>
                <q-spinner
                    :color="loadingColor"
                    size="1em"
                />
                Loading ...
            </h1>
        </div>

    </div>
</template>

<style>
video, .video-js {
  width: 90vw;
  height:90vh;
}
</style>

<script>
import { defineComponent } from '@vue/composition-api'
import customSlider from './customSlider'

export default defineComponent({
  components: { customSlider },
  name: 'videoPlayer',
  data () {
    return {
      fileInfos: [],
      audioStreamValue: null,
      subStreamValue: { label: 'None', value: -1, type: 1 },
      resizeValue: { label: 'Original', value: -1 },
      startFromValue: 0,
      resize: [
        { label: 'Original', value: -1 },
        { label: '1080p', value: 1080 },
        { label: '720p', value: 720 },
        { label: '480p', value: 480 },
        { label: '320p', value: 320 }
      ],
      remove3dValue: null,
      remove3D: [
        { label: 'None', value: 0 },
        { label: 'SIDE BY SIDE', value: 1 },
        { label: 'TOP AND BOTTOM', value: 2 }
      ],
      playing: false,
      videoUrl: null,
      loading: false,
      videojsPlayer: null,
      loadingInterval: null,
      loadingColor: 'primary',
      devices: [],
      bitmapCodecs: ['hdmv_pgs_subtitle', 'dvd_subtitle'],
      customSeekBuffer: 0,
      customSeekValue: -1,
      nextEpisode: -1,
      loadedStatus: 0,
      nativeVideo: false
    }
  },
  mounted () {
    this.loadData()
    window.addEventListener('hashchange', () => this.stopPlayer())
    window.addEventListener('beforeunload', () => this.stopPlayer())
  },
  computed: {
    duration: function () {
      return Math.round(this.fileInfos.duration / 60)
    },
    audioStream: function () {
      const data = []
      const a = this.fileInfos.audio
      for (let i = 0; i < (a === undefined ? 0 : a.length); i++) {
        data.push({ label: a[i].language, value: i, codec: a[i].codec })
      }
      return data
    },
    subStream: function () {
      const data = [{ label: 'None', value: -1, type: 1 }]
      const s = this.fileInfos.subtitles
      for (let i = 0; i < (s === undefined ? 0 : s.length); i++) {
        if ('file' in s[i]) {
          // subtitle file
          data.push({ label: s[i].language + ' | ' + s[i].title, value: s[i].file, type: 2 })
        } else {
          // subtitle streams included in the video file
          data.push({ label: s[i].language + ' | ' + s[i].title, value: i, type: 1 })
        }
      }
      return data
    },
    sliderLabelValue: function () {
      return Math.floor(this.startFromValue / 60) + ':' + this.startFromValue % 60
    }
  },
  methods: {
    loadData: function () {
      this.$apiCall('player/property?mediaType=' + this.mediaType + '&mediaData=' + this.mediaData)
        .then((response) => {
          this.fileInfos = response
          if (this.audioStream.length > 0) {
            this.audioStreamValue = this.audioStream[0]
          }
          if (this.subStream.length > 0) {
            this.subStreamValue = this.subStream[0]
          }
          this.remove3dValue = this.remove3D[response.stereo3d]
          this.startFromValue = response.startFrom

          this.setupParams()

          if (this.$store.getters.cast) {
            this.$apiCall('device')
              .then((response) => {
                response.forEach(dev => {
                  if (dev.enabled === 1 && dev.available === true) {
                    this.devices.push(dev)
                  }
                })
                this.loadedStatus++
              })
          } else if (this.$store.getters.receive) {
            this.$apiCall('device/1')
              .then((response) => {
                if (response.enabled === 1 && response.available === true) {
                  this.devices.push({
                    id: 1,
                    name: 'Remote Player',
                    type: 'web'
                  })
                  this.loadedStatus++
                }
              })
          } else {
            this.loadedStatus++
          }
          this.loadedStatus++
        })

      // try to get the next episode if this is a tv show type
      if (this.showNext && parseInt(this.mediaType) === 1) {
        this.$apiCall('tvs/episode/' + this.mediaData).then((resp) => {
          this.$apiCall('tvs/' + resp.idShow + '/episode').then((data) => {
            for (let i = 0; i < data.length; i++) {
              if (parseInt(this.mediaData) === data[i].id && i + 1 < data.length) {
                this.nextEpisode = data[i + 1].id
                break
              }
            }
          })
        })
      }

      this.loadedStatus++
    },
    setupParams () {
      // try to setup player according to the properties
      if (this.position !== undefined && Number.isInteger(this.position)) {
        this.startFromValue = this.position
      }
      if (this.audioStreamSetup !== undefined && Number.isInteger(this.subStreamSetup)) {
        this.subStreamValue = this.subStream[this.audioStreamSetup]
      }
      if (this.subStreamSetup !== undefined && Number.isInteger(this.subStreamSetup)) {
        for (let i = 0; i < this.subStream.length; i++) {
          if (this.subStream[i].type === 1 && this.subStream[i].value === this.subStreamSetup) {
            this.subStreamValue = this.subStream[i]
          }
        }
      }
      if (this.subFileSetup !== undefined) {
        for (let i = 0; i < this.subStream.length; i++) {
          if (this.subStream[i].type === 2 && this.subStream[i].value === this.subFileSetup) {
            this.subStreamValue = this.subStream[i]
          }
        }
      }
      if (this.resizeSetup !== undefined && Number.isInteger(this.resizeSetup)) {
        for (let i = 0; i < this.resize.length; i++) {
          if (this.resize[i].value === this.resizeSetup) {
            this.resizeValue = this.resize[i]
          }
        }
      }
      if (this.remove3dSetup !== undefined && Number.isInteger(this.remove3dSetup)) {
        this.remove3dValue = this.remove3D[this.remove3dSetup]
      }
    },
    createPlayer: function () {
      this.$refs.videoPlayerContainer.innerHTML = '<video id="videoPlayer" class="video-js vjs-default-skin" controls preload="auto"></video>'
      this.videojsPlayer = this.$videojs(document.querySelector('#videoPlayer'), { autoplay: true, playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] })
      this.attachListeners()
    },
    attachListeners: function () {
      this.videojsPlayer.on('timeupdate', () => {
        this.$emit('time', this.videojsPlayer.currentTime())
      })
      this.videojsPlayer.on('pause', () => {
        this.$emit('status', 1)
      })
      this.videojsPlayer.on('play', () => {
        this.$emit('status', 2)
      })
      this.videojsPlayer.on('ended', () => {
        this.$emit('status', 0)
      })
    },
    playNativeVideo: function () {
      this.nativeVideo = true
      // try to play native video and fall back to transcoding if it's not possible
      if ((this.audioStream.length > 1 && this.audioStreamValue.value !== 0) || (this.subStreamValue.codec in this.bitmapCodecs) || this.resizeValue.value !== -1 || this.remove3dValue.value !== 0) {
        // multiple audio streams and bitmap subtitles are not supported by browser
        // also, video resize and 3D removal must be done on the server side
        this.playVideo(-1)
        return
      }

      const videoMime = {
        ogg: 'video/ogg; codecs="theora"',
        h264: 'video/mp4; codecs="avc1.42E01E"',
        webm: 'video/webm; codecs="vp8, vorbis"',
        vp9: 'video/webm; codecs="vp9"',
        hls: 'application/x-mpegURL; codecs="avc1.42E01E"'
      }
      const audioMime = {
        dts: 'audio/vnd.dts'
      }
      const testVid = document.createElement('video')
      const support = testVid.canPlayType(videoMime[this.fileInfos.video_codec] || 'video/' + this.fileInfos.video_codec) !== '' && testVid.canPlayType(audioMime[this.audioStreamValue.codec] || 'audio/' + this.audioStreamValue.codec) !== ''

      if (!support) {
        // the browser doesn't report that the codec is supported
        this.playVideo(-1)
        return
      }

      // try to play the file
      this.$apiCall('player/file?mediaType=' + this.mediaType + '&mediaData=' + this.mediaData)
        .then((videoUrl) => {
          this.playing = true
          this.createPlayer()
          this.addSubtitleTracks(false)
          this.videojsPlayer.on('error', () => {
            // if there is an error while playing, fall back to transcoding
            this.playVideo(-1)
          })
          this.videojsPlayer.src({
            src: videoUrl,
            type: 'video/mp4'
          })
          this.videojsPlayer.currentTime(this.startFromValue)
        })
    },
    addSubtitleTracks: function (useStartFrom = true) {
      for (let i = 0; i < this.subStream.length; i++) {
        if (!(this.subStream[i].codec in this.bitmapCodecs) && this.subStream[i].value !== -1) {
          let src = this.$store.getters.apiEndpoint + 'player/subtitle?mediaType=' + this.mediaType + '&mediaData=' + this.mediaData + '&token=' + this.$store.state.token + '&startFrom=' + (useStartFrom ? this.startFromValue : 0)

          if (this.subStream[i].type === 1) {
            src += '&subStream=' + this.subStream[i].value
          } else if (this.subStream[i].type === 2) {
            src += '&subFile=' + this.subStream[i].value
          }

          this.videojsPlayer.addRemoteTextTrack({
            kind: 'subtitles',
            language: 'en',
            label: this.subStream[i].label,
            src: src,
            // eslint-disable-next-line quote-props
            'default': this.subStream[i].value === this.subStreamValue.value
          }, true)
        }
      }
    },
    playVideo: function (idDevice = -1, forceSubs = false) {
      this.nativeVideo = false
      // start transcoding
      this.createPlayer()
      this.customSeekValue = -1
      this.loading = true
      this.loadingColor = 'orange'
      this.playing = true
      let audio = '0'
      if (this.audioStreamValue !== null) {
        audio = this.audioStreamValue.value
      }
      let subStream = '-1'
      if (this.subStreamValue !== null && this.subStreamValue.value !== null) {
        if ((this.subStreamValue.codec in this.bitmapCodecs) || forceSubs || idDevice !== -1) {
          // set substream to burn the subtitles if the codec is bitmap-type or if user wants to force it
          // subStream is also set if you are casting to a device
          subStream = this.subStreamValue.value
        } else {
          // else add text subtitles directly to videojs player
          this.addSubtitleTracks()
          // update the custom progress bar
          this.customSeekValue = 0
          this.videojsPlayer.on('timeupdate', () => {
            this.customSeekBuffer = Math.floor(this.videojsPlayer.buffered().end(0) + this.startFromValue)
            this.customSeekValue = Math.floor(this.videojsPlayer.currentTime() + this.startFromValue)
          })
        }
      }

      this.$apiCall('player/start', { mediaType: this.mediaType, mediaData: this.mediaData, audioStream: audio, subStream: subStream, startFrom: this.startFromValue, resize: this.resizeValue.value, remove3D: this.remove3dValue.value, idDevice: idDevice }, 'POST')
        .then(() => {
          if (idDevice < 0) {
            this.loadingColor = 'primary'
            this.loadingInterval = setInterval(this.checkStatus, 4000)
          } else {
            this.playing = false
            this.$router.push({ name: 'remote', params: { device: idDevice } })
          }
        })
    },
    checkStatus: function () {
      this.$apiCall('player/status', null, 'GET', false)
        .then((resp) => {
          if (resp.available && resp.running) {
            // playlist is available, stop loading
            this.loading = false
            clearInterval(this.loadingInterval)
            this.loadingInterval = null
            // play playlist
            const videoUrl = this.$store.getters.apiEndpoint + 'player/m3u8?token=' + this.$store.state.token
            this.videojsPlayer.src({
              src: videoUrl,
              type: 'application/x-mpegURL'
            })
            this.videojsPlayer.currentTime(0)
          } else if (!resp.running) {
            clearInterval(this.loadingInterval)
            this.playing = false
            this.$q.notify({
              message: 'Transcoding Error',
              icon: 'mdi-alert',
              position: 'bottom-left',
              color: 'red'
            })
          }
        }).catch(() => {})
    },
    stopPlayer: function () {
      if (this.loadingInterval !== null) {
        clearInterval(this.loadingInterval)
      }
      if (this.playing) {
        if (this.videojsPlayer !== null) {
          this.$apiCall('player/stop?mediaType=' + this.mediaType + '&mediaData=' + this.mediaData + '&endTime=' + (this.fileInfos.startFrom + this.videojsPlayer.currentTime()))
          this.videojsPlayer.dispose()
        } else if (this.$refs.videoPlayer !== undefined) {
          this.$apiCall('player/stop?mediaType=' + this.mediaType + '&mediaData=' + this.mediaData + '&endTime=' + this.$refs.videoPlayer.currentTime)
        } else {
          this.$apiCall('player/stop?mediaType=' + this.mediaType + '&mediaData=' + this.mediaData + '&endTime=0')
        }
        this.playing = false
      }
    },
    seekChange: function (val) {
      this.customSeekValue = val
      if ((this.customSeekValue < this.startFromValue || this.customSeekValue > this.customSeekBuffer) && this.customSeekValue > 0 && !this.nativeVideo) {
        console.log('restarting transcoder')
        this.startFromValue = this.customSeekValue
        this.stopPlayer()
        this.playVideo(-1)
      } else {
        this.videojsPlayer.currentTime(this.customSeekValue - this.startFromValue)
      }
    },
    skipEpisode: function () {
      this.stopPlayer()
      this.$router.push({ name: 'playItem', params: { mediaType: 1, data: this.nextEpisode } })
    }
  },
  beforeDestroy: function () {
    this.stopPlayer()
  },
  watch: {
    $route (to, from) {
      // reload data on route change
      this.loadData()
    },
    startPlayer: function (newVal) {
      if (newVal && !this.playing) {
        this.playNativeVideo()
      } else if (!newVal && this.playing) {
        this.stopPlayer()
      }
    },
    position: function (newVal) {
      if (this.playing) {
        this.seekChange(newVal)
      }
    },
    subStreamSetup: function (newVal) {
      if (newVal !== undefined && Number.isInteger(newVal)) {
        this.subStreamValue = this.subStream[newVal]
      }
    },
    audioStreamSetup: function (newVal) {
      if (newVal !== undefined && Number.isInteger(newVal)) {
        this.audioStreamValue = this.audioStream[newVal]
      }
    },
    resizeSetup: function (newVal) {
      if (newVal !== undefined && Number.isInteger(newVal)) {
        this.resizeValue = newVal
      }
    },
    remove3dSetup: function (newVal) {
      if (newVal !== undefined && Number.isInteger(newVal)) {
        this.remove3dValue = newVal
      }
    },
    status: function (newVal) {
      if (!this.playing) {
        return
      }

      if (newVal === 0) {
        this.stopPlayer()
      } else if (newVal === 1 && !this.videojsPlayer.paused()) {
        this.videojsPlayer.pause()
      } else if (newVal === 2 && this.videojsPlayer.paused()) {
        this.videojsPlayer.play()
      }
    },
    loadedStatus: function (val) {
      if (val >= 3) {
        // the page is considered as fully loaded
        if (this.startPlayer) {
          this.playNativeVideo()
        }
      }
    }
  },
  props: {
    mediaType: {
      required: true
    },
    mediaData: {
      required: true
    },
    startPlayer: {
      required: false,
      default: false
    },
    audioStreamSetup: {
      required: false,
      default: undefined
    },
    subStreamSetup: {
      required: false,
      default: undefined
    },
    resizeSetup: {
      required: false,
      default: undefined
    },
    remove3dSetup: {
      required: false,
      default: undefined
    },
    position: {
      required: false,
      default: undefined
    },
    status: {
      required: false,
      default: 2
    },
    showNext: {
      required: false,
      default: true
    }
  }
})

</script>
