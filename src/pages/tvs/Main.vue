<template>
  <q-page class="row wrap justify-around">
    <tvsCard v-for="item in tvs" v-bind:title="item.title" v-bind:link="{name: 'tvshow', params: {id: item.id}}" v-bind:img="$store.getters.imageEndpoint+item.icon" v-bind:nbEp="item.episodes" v-bind:watchedEp="item.watchedEpisodes"></tvsCard>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'

import tvsCard from 'pages/tvs/components/tvsCard.vue'

export default Vue.extend({
  components: { tvsCard },
  data () {
    return {
      tvs: []
    }
  },
  mounted () {
    this.$apiCall('tvs/getShows')
      .then((response) => {
        this.tvs = response
      })
  }
})
</script>
