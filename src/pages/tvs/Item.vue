<template>
  <q-page>
    <backgroundImage :image="tvs.fanart"/>

    <div class="row wrap justify-around">
      <q-img :src="image" @error="image = '/images/undefined_v.png'" class="col-3 q-mt-lg tvsIcon rounded-borders order-1"></q-img>

      <tags class="col-12 col-sm-4 col-md-3 q-mt-lg q-mt-lg tvsCard" :idMedia="$route.params.id" :mediaType="2" v-if="!$q.screen.lt.sm"/>
      <tvsDesc v-if="!$q.screen.lt.sm" class="col-12 col-md-5 q-mt-lg tvsCard" :title="tvs.title" :premiered="tvs.premiered" :overview="tvs.overview" :rating="tvs.rating" :scraperLink="tvs.scraperLink" :scraperName="tvs.scraperName" :seasons="tvs.season" :episodes="tvs.episode" :watchedEpisodes="tvs.watchedEpisodes"/>
    </div>
    <br>
    <seasons :idShow="$route.params.id" />

    <tvsDesc v-if="$q.screen.lt.sm" class="col-12 col-md-5 q-mt-lg tvsCard" :title="tvs.title" :premiered="tvs.premiered" :overview="tvs.overview" :rating="tvs.rating" :scraperLink="tvs.scraperLink" :scraperName="tvs.scraperName" :seasons="tvs.season" :episodes="tvs.episode" :watchedEpisodes="tvs.watchedEpisodes"/>
    <tags class="col-12 col-sm-4 col-md-3 q-mt-lg q-mt-lg tvsCard" :idMedia="$route.params.id" :mediaType="2" v-if="$q.screen.lt.sm"/>

  </q-page>
</template>

<style scoped>
.tvsIcon {
  height: 30rem;
  width: 23em;
}
.tvsCard {
  height: 30rem;
  opacity: 0.8;
  overflow: scroll;
}
</style>

<script>
import Vue from 'vue'
import seasons from './components/seasons'
import backgroundImage from '../components/backgroundImage'
import tags from '../components/tags'
import tvsDesc from './components/tvsDesc'

export default Vue.extend({
  components: { seasons, backgroundImage, tags, tvsDesc },
  data () {
    return {
      tvs: [],
      image: '/images/undefined_v.png'
    }
  },
  mounted () {
    this.$apiCall('tvs/' + this.$route.params.id)
      .then((response) => {
        this.tvs = response
        this.image = this.$store.getters.imageEndpoint + this.tvs.icon
      })
  }
})
</script>
