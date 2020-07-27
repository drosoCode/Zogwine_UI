<template>
    <q-scroll-area
      horizontal
      style="height: 22em;"
      class="q-mx-xl"
    >
    <div class="row wrap no-wrap-sm">
        <tvsCard class="seasonCard" v-for="item in seasons" v-bind:title="item.title" v-bind:link="{name: 'season', params: {id: idShow, season: item.season}}" v-bind:img="item.icon" v-bind:nbEp="item.episodes" v-bind:watchedEp="item.watchedEpisodes"></tvsCard>
    </div>
    </q-scroll-area>
</template>

<style scoped>
.seasonCard {
    height: 20em;
    width: 15em;
}
</style>

<script>
import { defineComponent } from '@vue/composition-api'
import tvsCard from 'pages/tvs/components/tvsCard'

export default defineComponent({
  components: { tvsCard },
  name: 'seasons',
  data () {
    return {
      seasons: [],
      slide: 1
    }
  },
  mounted () {
    this.$apiCall('tvs/getSeasons?idShow=' + this.idShow)
      .then((response) => {
        this.seasons = response
      })
  },
  props: {
    idShow: {
      required: true
    }
  }
})
</script>
