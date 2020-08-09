<template>
    <div class="q-ma-md">
      <div class="row wrap">
        <h4 class="q-ma-xs">Statistics</h4>
        <br>
        <q-separator/>
          <statCard class="col-xs-12 col-sm-5 col-md-3 col-lg-3 col-xl-2 q-my-md q-mx-sm-md" icon="tv" title="TV Shows" :value="stats.tvsCount" color="secondary"/>
          <statCard class="col-xs-12 col-sm-5 col-md-3 col-lg-3 col-xl-2 q-my-md q-mx-sm-md" icon="receipt" title="Episodes" :value="stats.watchedEpCount + '/' + stats.epCount" color="secondary"/>
          <statCard class="col-xs-12 col-sm-5 col-md-3 col-lg-3 col-xl-2 q-my-md q-mx-sm-md" icon="schedule" title="Lost Time" :value="stats.lostTime + 'H'" color="negative"/>
          <statCard class="col-xs-12 col-sm-5 col-md-3 col-lg-3 col-xl-2 q-my-md q-mx-sm-md" icon="local_movies" title="Movies" :value="stats.watchedMoviesCount + '/' + stats.moviesCount" color="primary"/>
      </div>
      <div class="row wrap">
        <h4 class="q-ma-xs">Upcoming Episodes</h4>
        <q-separator/>
          <episodeCard v-for="item in ep" :key="item.id" class="col-xs-6 col-sm-5 col-md-3 col-lg-3 col-xl-2 q-px-md q-pt-md" :date="item.date" :img="item.icon" :title="item.title" :overview="item.overview" :season="item.season" :episode="item.episode" :showTitle="item.showTitle"/>
      </div>
    </div>
</template>

<script>
import Vue from 'vue'
import statCard from './components/statCard'
import episodeCard from './components/episodeCard'

export default Vue.extend({
  components: { statCard, episodeCard },
  data () {
    return {
      stats: [],
      ep: []
    }
  },
  mounted () {
    this.$apiCall('core/getStatistics')
      .then((response) => {
        this.stats = response
      })
    this.$apiCall('tvs/getUpcomingEpisodes')
      .then((response) => {
        this.ep = response
      })
  }
})
</script>
