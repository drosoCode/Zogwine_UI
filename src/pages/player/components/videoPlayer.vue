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
            <q-btn color="teal" class="full-width" label="Start Transcoder" icon="play_arrow" @click="playVideo"/>
        </div>

        <div v-if="playing && nativePlayer">
            <video controls ref="videoPlayer">
                <source :src="videoUrl" type="video/mp4">
                <p>HTML5 video error</p>
            </video>
        </div>

        <div v-if="playing && !nativePlayer" :hidden="loading">
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
      subStreamValue: { label: 'None', value: -1 },
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
      nativePlayer: false,
      videoUrl: null,
      loading: false,
      videojsPlayer: null,
      loadingInterval: null,
      nativelySupported: false,
      loadingColor: 'primary'
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
      const data = [{ label: 'None', value: -1 }]
      const s = this.fileInfos.subtitles
      for (let i = 0; i < s.length; i++) {
        data.push({ label: s[i].language + ' | ' + s[i].title, value: i })
      }
      return data
    }
  },
  methods: {
    playNativeVideo: function () {
      this.playing = true
      this.nativePlayer = true
      this.videoUrl = this.$store.getters.apiEndpoint + 'player/file?mediaType=' + this.mediaType + '&mediaData=' + this.mediaData + '&token=' + this.$store.state.token
    },
    playVideo: function () {
      // start transcoding
      this.loading = true
      this.loadingColor = 'orange'
      this.playing = true
      this.nativePlayer = false
      let audio = '0'
      if (this.audioStreamValue !== null) {
        audio = this.audioStreamValue.value
      }
      let sub = '-1'
      if (this.subStreamValue !== null) {
        sub = this.subStreamValue.value
      }
      this.$apiCall('player/start?mediaType=' + this.mediaType + '&mediaData=' + this.mediaData + '&audioStream=' + audio + '&subStream=' + sub + '&startFrom=' + parseInt(this.startFromValue) * 60 + '&resize=' + this.resizeValue.value + '&remove3D=' + this.remove3dValue.value)
        .then(() => {
          this.loadingColor = 'primary'
          this.loadingInterval = setInterval(this.checkPlaylist, 10000)
        })
    },
    checkPlaylist: function () {
      this.$apiCall('player/m3u8', false)
        .then((resp) => {
          if (resp !== 404) {
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
          }
        })
    },
    stopPlayer: function () {
      if (this.loadingInterval !== null) {
        clearInterval(this.loadingInterval)
      }
      if (this.playing) {
        if (this.videojsPlayer !== null) {
          this.$apiCall('player/stop?mediaType=' + this.mediaType + '&mediaData=' + this.mediaData + '&endTime=' + this.videojsPlayer.currentTime())
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
