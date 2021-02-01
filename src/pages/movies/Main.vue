<template>
  <q-page class="row wrap justify-around q-mb-lg">
      <div v-for="item in display" :key="item.id" class="q-px-md q-pt-md col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2">
        <movCard v-if="'idCollection' in item" :title="item.title" :link="{name: 'movie', params: {id: item.id}}" :img="item.icon" :watchCount="item.watchCount" :premiered="item.premiered"></movCard>
        <collectionCard v-else :title="item.title" :link="{name: 'movie_collection', params: {id: item.id}}" :img="item.icon" :movieCount="item.movieCount" :watchedMovies="item.watchedMovies"></collectionCard>
      </div>
  </q-page>
</template>

<script>
import Vue from 'vue'

import movCard from './components/movCard.vue'
import collectionCard from './components/collectionCard.vue'

export default Vue.extend({
  components: { movCard, collectionCard },
  data () {
    return {
      movies: [],
      collections: []
    }
  },
  computed: {
    display: function () {
      const ret = []
      const includedCollections = []
      for (let i = 0; i < this.movies.length; i++) {
        if (this.movies[i].idCollection == null) {
          ret.push(this.movies[i])
        } else {
          if (includedCollections.indexOf(this.movies[i].idCollection) === -1) {
            let j = 0
            while (j < this.collections.length) {
              if (this.collections[j].id === this.movies[i].idCollection) {
                ret.push(this.collections[j])
                break
              }
              j++
            }
            includedCollections.push(this.movies[i].idCollection)
          }
        }
      }
      console.log(ret)
      return ret
    }
  },
  mounted () {
    this.$apiCall('movie')
      .then((response) => {
        this.movies = response
      })
    this.$apiCall('movie/collection')
      .then((response) => {
        this.collections = response
        console.log(this.display)
      })
  }
})
</script>
