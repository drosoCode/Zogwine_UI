<template>
  <q-page>
    <backgroundImage :image="tvs.fanart"/>

    <div v-focus-section class="row wrap justify-around">

        <q-card class="q-ma-sm-lg tvsCard row">
            <q-img :src="image" @error="image = '/images/undefined_v.png'" class="col-3 tvsIcon rounded-borders q-pa-sm"></q-img>
            <div class="col-xs-5 col-sm-8 col-md-4 q-pt-md q-pl-md">
                <div class="text-h6">{{ tvs.title }} - {{ season.title }}</div>
                Season: {{ season.season }} <br>
                Episodes: {{ season.episodes }} <br>
                Premiered: {{ season.premiered }} <br>
                <br>
                <q-chip square :color="chipColor" text-color="white" :icon="watchIcon">Watched {{ season.watchedEpisodes }} / {{ season.episodes }}</q-chip>
                <q-btn color="secondary" label="Toggle" @click="toggleSeason" size="sm" />
            </div>
            <div class="col-12 col-md-6 q-pt-md">
                {{ overview }}
            </div>
        </q-card>

        <episodeCard class="q-px-md q-pt-md col-xs-6 col-sm-5 col-md-3 col-lg-3 col-xl-2" v-for="item in episodes" :key="item.id" :id="item.id" :filler="item.filler" :title="item.title" :overview="item.overview" :img="item.icon" :episode="item.episode" :watchCount="item.watchCount" :showDetails="item.episode == $route.params.episode ? true : false"></episodeCard>

    </div>
    <br>

  </q-page>
</template>

<style scoped>
.tvsIcon {
  height: 15rem;
  width: 10rem;
}
.tvsCard {
  width: 100%;
  opacity: 0.8;
}
</style>

<script>
import Vue from 'vue'
import backgroundImage from '../components/backgroundImage'
import episodeCard from './components/episodeCard'

export default Vue.extend({
  components: { backgroundImage, episodeCard },
  data () {
    return {
      season: [],
      episodes: [],
      tvs: [],
      image: '/images/undefined_v.png'
    }
  },
  computed: {
    chipColor: function () {
      if (this.season.watchedEpisodes === 0) {
        return 'red'
      } else if (this.season.watchedEpisodes === this.season.episodes) {
        return 'teal'
      } else {
        return 'orange'
      }
    },
    watchIcon: function () {
      if (this.season.watchedEpisodes === 0) {
        return 'clear'
      } else if (this.season.watchedEpisodes === this.season.episodes) {
        return 'done'
      } else {
        return 'schedule'
      }
    },
    overview: function () {
      if (this.season.overview === '') {
        return 'No data available'
      } else {
        return this.season.overview
      }
    }
  },
  mounted () {
    this.$apiCall('/tvs/' + this.$route.params.id + '/season/' + this.$route.params.season)
      .then((response) => {
        this.season = response[0]
        this.image = this.$store.getters.imageEndpoint + this.season.icon
      })
    this.$apiCall('/tvs/' + this.$route.params.id + '/season/' + this.$route.params.season + '/episode')
      .then((response) => {
        this.episodes = response
      })
    this.$apiCall('tvs/' + this.$route.params.id)
      .then((response) => {
        this.tvs = response
      })
  },
  methods: {
    toggleSeason: function () {
      this.$apiCall('/tvs/' + this.$route.params.id + '/season/' + this.$route.params.season + '/status', null, 'PUT')
        .then((response) => {
          this.$q.notify({
            message: 'Season status updated',
            icon: 'done',
            position: 'bottom-left',
            color: 'teal'
          })
        })
    }
  }
})
</script>
