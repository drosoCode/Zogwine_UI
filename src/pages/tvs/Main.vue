<template>
  <q-page v-focus-section class="row wrap justify-around q-mb-lg">
    <tvsCard v-focus v-for="item in tvs" :key="item.id" :title="item.title" :link="{name: 'tvshow', params: {id: item.id}}" :img="item.icon" :nbEp="item.episodes" :watchedEp="item.watchedEpisodes"></tvsCard>
  </q-page>
</template>

<script>
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
    this.$apiCall('tvs')
      .then((response) => {
        this.tvs = response
      })
  }
})
</script>
