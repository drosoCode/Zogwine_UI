<template>
    <div>
        <div v-if="!playing">
            <q-chip square color="primary" text-color="white" icon="local_fire_department">Codec: {{ fileInfos.general.video_codec }}</q-chip>
            <q-chip square color="primary" text-color="white" icon="camera">Format: {{ fileInfos.general.format }}</q-chip>
            <q-chip square color="primary" text-color="white" icon="access_time">Duration: {{ duration }} min</q-chip>
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
            <q-slider
                v-model="startFromValue"
                :min="startFromMin"
                :max="duration"
                :step="1"
                label
                color="teal"
            />
            <br>
            <q-btn color="teal" class="full-width" label="Start" icon="play_arrow" @click="playVideo"/>
        </div>

        <div v-if="playing && nativePlayer">
            <video controls>
                <source :src="videoUrl" type="video/mp4">
                <p>HTML5 video error</p>
            </video>
        </div>

        <div v-if="playing && !nativePlayer" :hidden="loading">
            <video ref="videojsPlayer" class="video-js vjs-default-skin" controls preload="auto"></video>
        </div>

        <div v-if="loading">
            <h1>
                <q-spinner
                    color="primary"
                    size="1em"
                />
                Loading ...
            </h1>
        </div>

    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'videoInfo',
  data () {
    return {
      fileInfos: [],
      audioStreamValue: null,
      subStreamValue: null,
      resizeValue: { label: 'Original', value: -1 },
      startFromValue: 0,
      startFromMin: 0,
      resize: [
        { label: 'Original', value: 0 },
        { label: '1080p', value: 1080 },
        { label: '720p', value: 720 },
        { label: '480p', value: 480 },
        { label: '320p', value: 320 }
      ],
      playing: false,
      nativePlayer: false,
      videoUrl: null,
      loading: false,
      videojsPlayer: null,
      interval: null
    }
  },
  mounted () {
    this.$apiCall('player/getInfos?mediaType=' + this.mediaType + '&mediaData=' + this.mediaData)
      .then((response) => {
        this.fileInfos = response
        if (this.audioStream.length > 0) {
          this.audioStreamValue = this.audioStream[0]
        }
        if (this.subStream.length > 0) {
          this.subStreamValue = this.subStream[0]
        }
      })
  },
  computed: {
    duration: function () {
      return Math.round(this.fileInfos.general.duration / 60)
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
      const data = []
      const s = this.fileInfos.subtitles
      for (let i = 0; i < s.length; i++) {
        data.push({ label: s[i].language + ' | ' + s[i].title, value: i })
      }
      return data
    }
  },
  methods: {
    playVideo: function () {
      this.playing = true
      if (this.fileInfos.general.format.includes('mp4')) {
        this.nativePlayer = true
        this.videoUrl = this.$store.getters.apiEndpoint + 'player/getFile?mediaType=' + this.mediaType + '&mediaData=' + this.mediaData + '&token=' + this.$store.state.token
      } else {
        this.nativePlayer = false
        // start transcoding
        const audio = this.audioStreamValue.value || '0'
        const sub = this.subStreamValue.value || '0'
        this.$apiCall('player/start?audioStream=' + audio + '&subStream=' + sub + '&startFrom=' + this.startFromValue + '&resize=' + this.resizeValue.value)
          .then(() => {
            this.loading = true
            this.interval = setInterval(this.checkPlaylist, 10000)
          })
      }
    },
    checkPlaylist: function () {
      this.$apiCall('player/m3u8', false)
        .then((resp) => {
          if (resp !== 404) {
            // playlist is available, stop loading
            this.loading = false
            clearInterval(this.interval)
            this.interval = null
            // play playlist
            const videoUrl = this.$store.getters.apiEndpoint + 'player/m3u8?token=' + this.$store.state.token
            this.videojsPlayer = this.$videojs(this.$refs.videojsPlayer, { liveui: true, autoplay: true })
            this.videojsPlayer.src({
              src: videoUrl,
              type: 'application/x-mpegURL'
            })
          }
        })
    }
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
