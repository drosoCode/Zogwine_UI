<template>
  <q-page class="row wrap justify-around">
    <movCard class="q-px-md q-pt-md col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2" v-for="item in movies" :title="item.title" :link="{name: 'movie', params: {id: item.id}}" :img="item.icon" :watchCount="item.watchCount" :premiered="item.premiered"></movCard>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'

import movCard from './components/movCard.vue'

export default Vue.extend({
  components: { movCard },
  data () {
    return {
      movies: []
    }
  },
  mounted () {
    this.$apiCall('movies/getMovies')
      .then((response) => {
        this.movies = response
      })
  }
})
</script>
