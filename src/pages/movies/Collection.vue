<template>
  <q-page>
    <backgroundImage :image="collection.fanart"/>

    <div class="row wrap justify-around">
      <q-img :src="$store.getters.imageEndpoint+collection.icon" class="col-3 q-mt-lg movIcon rounded-borders order-1"></q-img>
      <collectionDesc v-if="!$q.screen.lt.sm" class="col-12 col-md-9 q-mt-lg movCard" :title="collection.title" :premiered="collection.premiered" :overview="collection.overview" :watchedMovies="collection.watchedMovies" :movieCount="collection.movieCount" :scraperLink="collection.scraperLink" :scraperName="collection.scraperName" />
    </div>
    <br>

    <q-scroll-area
      horizontal
      style="height: 22em;"
      class="q-mx-xl"
    >
    <div class="row no-wrap">
        <movCard class="movCardList q-mr-lg" v-for="item in movs" :key="item.id" :title="item.title" :link="{name: 'movie', params: {id: item.id}}" :img="item.icon" :watchCount="item.watchCount" :premiered="item.premiered"></movCard>
    </div>
    </q-scroll-area>

    <collectionDesc v-if="$q.screen.lt.sm" class="col-12 col-md-5 q-mt-lg movCard" :title="collection.title" :premiered="collection.premiered" :overview="collection.overview" :watchedMovies="collection.watchedMovies" :movieCount="collection.movieCount" :scraperLink="collection.scraperLink" :scraperName="collection.scraperName" />
  </q-page>
</template>

<style scoped>
.movIcon {
  height: 30rem;
  width: 23em;
}
.movCard {
  height: 30rem;
  opacity: 0.8;
  overflow: scroll;
}
.movCardList {
    height: 20em;
    width: 15em;
}
</style>

<script>
import Vue from 'vue'
import backgroundImage from '../components/backgroundImage'
import collectionDesc from './components/collectionDesc'
import movCard from './components/movCard.vue'

export default Vue.extend({
  components: { backgroundImage, collectionDesc, movCard },
  data () {
    return {
      movs: [],
      collection: []
    }
  },
  mounted () {
    this.$apiCall('movie/fromCollection/' + this.$route.params.id)
      .then((response) => {
        this.movs = response
      })
    this.$apiCall('movies/collection/' + this.$route.params.id)
      .then((response) => {
        this.collection = response
      })
  }
})
</script>
