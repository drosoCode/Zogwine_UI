<template>
  <q-page>
    <backgroundImage :image="mov.fanart"/>

    <div class="row wrap justify-around">
      <q-img :src="itemImg" @error="itemImg = '/images/undefined_v.png'" class="col-3 q-mt-lg movIcon rounded-borders order-1"></q-img>

      <tags class="col-12 col-sm-4 col-md-3 q-mt-lg q-mt-lg movCard" :idMedia="$route.params.id" :mediaType="3" v-if="!$q.screen.lt.sm"/>
      <movDesc v-if="!$q.screen.lt.sm" class="col-12 col-md-5 q-mt-lg movCard" :title="mov.title" :premiered="mov.premiered" :overview="mov.overview" :rating="mov.rating" :scraperLink="mov.scraperLink" :scraperName="mov.scraperName" :watchCount="mov.watchCount"/>
    </div>
    <br>
    <q-card v-focus-section class="q-ma-md q-pa-md" style="opacity: 0.8;">
        <q-btn v-focus color="teal" class="full-width" label="Play" icon="play_arrow" @click="play" />
        <br><br>
        <q-btn color="orange" class="full-width" label="Download" icon="cloud_download" @click="download" />
    </q-card>

    <movDesc v-if="$q.screen.lt.sm" class="col-12 col-md-5 q-mt-lg movCard" :title="mov.title" :premiered="mov.premiered" :overview="mov.overview" :rating="mov.rating" :scraperLink="mov.scraperLink" :scraperName="mov.scraperName" :watchCount="mov.watchCount"/>
    <tags class="col-12 col-sm-4 col-md-3 q-mt-lg q-mt-lg movCard" :idMedia="$route.params.id" :mediaType="3" v-if="$q.screen.lt.sm"/>

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
</style>

<script>
import Vue from 'vue'
import backgroundImage from '../components/backgroundImage'
import tags from '../components/tags'
import movDesc from './components/movDesc'

export default Vue.extend({
  components: { backgroundImage, tags, movDesc },
  data () {
    return {
      mov: [],
      itemImg: '/images/undefined_v.png'
    }
  },
  mounted () {
    this.$apiCall('movie/' + this.$route.params.id)
      .then((response) => {
        this.mov = response
        this.itemImg = this.$store.getters.imageEndpoint + response.icon
      })
  },
  methods: {
    play: function () {
      this.$router.push({ name: 'playItem', params: { mediaType: 3, data: this.$route.params.id } })
    },
    download: function () {
      this.$apiCall('player/file?mediaType=3&mediaData=' + this.$route.params.id)
        .then((response) => {
          window.open(response)
        })
    }
  }
})
</script>
