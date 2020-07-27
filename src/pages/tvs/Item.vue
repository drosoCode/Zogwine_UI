<template>
  <q-page>
    <backgroundImage :image="tvs.fanart"/>

    <div class="row wrap justify-around">
      <q-img :src="$store.getters.imageEndpoint+tvs.icon" class="col-3 q-mt-lg tvsIcon rounded-borders"></q-img>

      <q-card class="col-12 col-sm-4 col-md-5 q-mt-lg tvsCard">
        <q-card-section>
          <div class="text-h6">{{ tvs.title }}</div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          Premiered: {{ tvs.premiered }} <br>
          Rating: {{ tvs.rating }} <br>
          Scraper: <a :href="tvs.scraperLink" target="_blank">{{ tvs.scraperName }}</a> <br>
          Seasons: {{ tvs.seasons }} <br>
          Episodes: {{ tvs.episodes }} <br>
          <br>
          <q-chip square :color="chipColor" text-color="white" :icon="watchIcon">Watched {{ tvs.watchedEpisodes }} / {{ tvs.episodes }}</q-chip>
          <br>
          <br>
          {{ tvs.overview }}
        </q-card-section>
      </q-card>
    </div>
    <br>
    <seasons :idShow="$route.params.id" />
    <br><br>

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
import backgroundImage from './components/backgroundImage'

export default Vue.extend({
  components: { seasons, backgroundImage },
  data () {
    return {
      tvs: []
    }
  },
  computed: {
    chipColor: function () {
      if (this.tvs.watchedEpisodes === 0) {
        return 'red'
      } else if (this.tvs.watchedEpisodes === this.tvs.episodes) {
        return 'teal'
      } else {
        return 'orange'
      }
    },
    watchIcon: function () {
      if (this.tvs.watchedEpisodes === 0) {
        return 'clear'
      } else if (this.tvs.watchedEpisodes === this.tvs.episodes) {
        return 'done'
      } else {
        return 'schedule'
      }
    }
  },
  mounted () {
    this.$apiCall('tvs/getShow?idShow=' + this.$route.params.id)
      .then((response) => {
        this.tvs = response
      })
  }
})
</script>
