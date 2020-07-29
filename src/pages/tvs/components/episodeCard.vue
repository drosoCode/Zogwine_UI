<template>
    <div>
        <q-card class="epCard" @click="play">
            <q-img :src="image" basic>
                <div class="absolute-bottom text-h6" @click="showDetails">
                    E{{ episode }} - {{ title }}
                </div>
            </q-img>
            <q-linear-progress value="100" :color="barColor"/>
        </q-card>

      <q-dialog v-model="details" position="right" full-height>
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
    showDetails: function () {
      this.details = true
    },
    play: function () {
      console.log('play')
    },
    download: function () {
      console.log('download')
    },
    toggleEpisodeStatus: function () {
      this.$apiCall('tvs/toggleEpisodeStatus?idEpisode=' + this.id)
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
        return this.$store.getters.imageEndpoint + '/static/icons/undefinedEp.png'
      }
    }
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
    }
  }
})
</script>