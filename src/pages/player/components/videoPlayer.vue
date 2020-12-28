<template>
    <div>
        <div v-if="!playing">
            <q-btn color="teal" class="full-width" label="Play Video" icon="play_arrow" @click="playNativeVideo" v-if="nativelySupported"/>
            <br>
            <br>
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
                :max="duration"
                :step="1"
                label
                color="teal"
            />
            <br>
            <q-btn-dropdown
              split
              class="full-width"
              color="teal"
              label="Start Transcoder"
              icon="play_arrow"
              @click="playVideo(-1)"
            >
              <q-list v-if="$store.getters.cast">
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
            <video ref="videoPlayer" class="video-js vjs-default-skin" controls preload="auto"></video>
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

<style scoped>
video, .video-js {
  width: 90vw;
  height:90vh;
}
</style>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'videoPlayer',
  data () {
    return {
      fileInfos: [],
      audioStreamValue: null,
      subStreamValue: { label: 'None', value: -1, type: 1 },
      resizeValue: { label: 'Original', value: -1 },
      startFromValue: 0,
      resize: [
        { label: 'Original', value: 0 },
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
      nativelySupported: false,
      loadingColor: 'primary',
      devices: null
    }
  },
  mounted () {
    this.$apiCall('player/info?mediaType=' + this.mediaType + '&mediaData=' + this.mediaData)
      .then((response) => {
        this.fileInfos = response
        if (this.fileInfos.format.includes('mp4')) {
          // if format is natively supported, display "play native" option
          this.nativelySupported = true
        }
        if (this.audioStream.length > 0) {
          this.audioStreamValue = this.audioStream[0]
        }
        if (this.subStream.length > 0) {
          this.subStreamValue = this.subStream[0]
        }
        this.remove3dValue = this.remove3D[response.stereo3d]
        this.startFromValue = Math.round(response.startFrom / 60)
        if (this.$store.getters.cast) {
          this.$apiCall('device/list')
            .then((response) => {
              this.devices = []
              response.forEach(dev => {
                if (dev.enabled === 1 && dev.available === true) {
                  this.devices.push(dev)
                }
              })
            })
        }
      })
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
      for (let i = 0; i < a.length; i++) {
        data.push({ label: a[i].language, value: i })
      }
      return data
    },
    subStream: function () {
      const data = [{ label: 'None', value: -1, type: 1 }]
      const s = this.fileInfos.subtitles
      for (let i = 0; i < s.length; i++) {
        if ('file' in s[i]) {
          // subtitle file
          data.push({ label: s[i].language + ' | ' + s[i].title, value: s[i].file, type: 2 })
        } else {
          // subtitle streams included in the video file
          data.push({ label: s[i].language + ' | ' + s[i].title, value: i, type: 1 })
        }
      }
      return data
    }
  },
  methods: {
    playNativeVideo: function () {
      this.playing = true
      const videoUrl = this.$store.getters.apiEndpoint + 'player/file?mediaType=' + this.mediaType + '&mediaData=' + this.mediaData + '&token=' + this.$store.state.token
      this.videojsPlayer = this.$videojs(this.$refs.videoPlayer, { liveui: true, autoplay: true })
      this.videojsPlayer.src({
        src: videoUrl,
        type: 'application/x-mpegURL'
      })
    },
    playVideo: function (idDevice) {
      // start transcoding
      this.loading = true
      this.loadingColor = 'orange'
      this.playing = true
      let audio = '0'
      if (this.audioStreamValue !== null) {
        audio = this.audioStreamValue.value
      }
      let subStream = '-1'
      let subFile = ''
      if (this.subStreamValue !== null && this.subStreamValue.value !== null) {
        if (this.subStreamValue.type === 1) {
          subStream = this.subStreamValue.value
        } else if (this.subStreamValue.type === 2) {
          subFile = this.subStreamValue.value
        }
      }
      this.$apiCall('player/start?mediaType=' + this.mediaType + '&mediaData=' + this.mediaData + '&audioStream=' + audio + '&subStream=' + subStream + '&subFile=' + subFile + '&startFrom=' + parseInt(this.startFromValue) * 60 + '&resize=' + this.resizeValue.value + '&remove3D=' + this.remove3dValue.value + '&idDevice=' + idDevice)
        .then(() => {
          if (idDevice === -1) {
            this.loadingColor = 'primary'
            this.loadingInterval = setInterval(this.checkPlaylist, 10000)
          } else {
            this.playing = false
            this.$router.push({ name: 'player' })
          }
        })
    },
    checkPlaylist: function () {
      this.$apiCall('player/m3u8', null, 'GET', false)
        .then((resp) => {
          // playlist is available, stop loading
          this.loading = false
          clearInterval(this.loadingInterval)
          this.loadingInterval = null
          // play playlist
          const videoUrl = this.$store.getters.apiEndpoint + 'player/m3u8?token=' + this.$store.state.token
          this.videojsPlayer = this.$videojs(this.$refs.videoPlayer, { liveui: true, autoplay: true })
          this.videojsPlayer.src({
            src: videoUrl,
            type: 'application/x-mpegURL'
          })
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
    }
  },
  beforeDestroy: function () {
    this.stopPlayer()
  },
  props: {
    mediaType: {
      required: true
    },
    mediaData: {
      required: true
    }
  }
})
</script>
