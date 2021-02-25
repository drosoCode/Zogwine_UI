<template>
    <div>
        <q-card class="epCard" @click="play">
            <q-img :src="image" basic>
                <div class="absolute-bottom text-h6" @click.stop="detailsPanel(true)">
                    E{{ episode }} - {{ title }}
                    <q-badge transparent align="middle" :color="fillerColor" v-if="filler > 0">
                      Filler
                    </q-badge>
                </div>
            </q-img>
            <q-linear-progress :value="100" :color="barColor"/>
        </q-card>

      <q-dialog v-model="details" position="right" full-height @click="detailsPanel(false)">
        <q-card>
            <q-card-section>
              <div class="text-h6">
                Episode {{ episode }}: {{ title }}
                &nbsp;&nbsp;
                <q-btn color="primary" label="Toggle" size="sm" @click="toggleEpisodeStatus" />
              </div>
            </q-card-section>
            <q-separator inset />
            <q-card-section>
              <q-btn color="teal" class="full-width" label="Play" icon="play_arrow" @click="play" />
              <br><br>
              <q-btn color="orange" class="full-width" label="Download" icon="cloud_download" @click="download" />
              <br><br>
              {{ overview }}
            </q-card-section>
          </q-card>
      </q-dialog>
    </div>
</template>

<style scoped>
.body--dark .epCard:hover {
    box-shadow: 6px 10px #000000;
}
</style>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'episodeCard',
  data () {
    return {
      details: false
    }
  },
  methods: {
    detailsPanel: function (show) {
      this.details = show
    },
    play: function () {
      this.$router.push({ name: 'playItem', params: { mediaType: 1, data: this.id } })
    },
    download: function () {
      this.$apiCall('player/file?mediaType=1&mediaData=' + this.id)
        .then((response) => {
          window.open(response)
        })
    },
    toggleEpisodeStatus: function () {
      this.$apiCall('tvs/episode/' + this.id + '/status', null, 'PUT')
        .then((response) => {
          this.$q.notify({
            message: 'Episode status updated',
            icon: 'done',
            position: 'bottom-left',
            color: 'teal'
          })
        })
    }
  },
  computed: {
    barColor: function () {
      if (this.watchCount > 0) {
        return 'teal'
      } else {
        return 'red'
      }
    },
    image: function () {
      if (this.img !== null) {
        return this.$store.getters.imageEndpoint + this.img
      } else {
        return '/images/undefined_h.png'
      }
    },
    fillerColor: function () {
      if (this.filler === 1) {
        return 'orange'
      } else {
        return 'red'
      }
    }
  },
  mounted () {
    this.details = this.showDetails
  },
  props: {
    title: {
      required: true
    },
    overview: {
      required: true
    },
    img: {
      required: true
    },
    episode: {
      required: true
    },
    watchCount: {
      required: true
    },
    id: {
      required: true
    },
    filler: {
      required: true
    },
    showDetails: {
      required: false,
      default: false
    }
  }
})
</script>
