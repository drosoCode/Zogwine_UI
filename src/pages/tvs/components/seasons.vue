<template>
    <q-scroll-area
      horizontal
      style="height: 22em;"
      class="q-mx-xl"
    >
    <div v-focus-section class="row no-wrap">
        <tvsCard v-focus class="seasonCard" v-for="item in seasons" :key="item.id" :title="item.title" :link="{name: 'season', params: {id: idShow, season: item.season}}" :img="item.icon" :nbEp="item.episode" :watchedEp="item.watchedEpisode"></tvsCard>
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
    this.$apiCall('tvs/' + this.idShow + '/season')
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
