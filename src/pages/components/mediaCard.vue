<template>
    <div>
        <q-card class="fit">
            <q-card-section horizontal class="section">
                <q-card-section :class="{'flex': true, 'flex-center': true, 'section': true, 'col-6 q-ml-md q-mr-lg': !vertical, 'col-5': vertical}">
                    <q-img
                        :src="$store.getters.imageEndpoint + data.icon"
                        :class="{'rounded-borders': true, 'hImg': !vertical,  'vImg': vertical}"
                    />
                </q-card-section>

                <q-card-section v-if="mediaType == 1" class="section">
                    <router-link :to="{ name: 'episode', params: { id: data.idShow, season: data.season, episode: data.episode } }"><h6 class="q-my-lg">{{ data.title }}</h6></router-link>
                    <br>
                    Type: TV Show Episode
                    <br>
                    TVS: <router-link :to="{ name: 'tvshow', params: { id: data.idShow } }">{{ data2.title }}</router-link>
                    <br>
                    Season: {{ data.season }}
                    <br>
                    Episode: {{ data.episode }}
                    <br>
                    Rating: {{ data.rating }}
                </q-card-section>

                <q-card-section v-if="mediaType == 2" class="section">
                    <router-link :to="{ name: 'tvshow', params: { id: data.idShow } }"><h6 class="q-my-lg">{{ data.title }}</h6></router-link>
                    <br>
                    Type: TV Show
                    <br>
                    Premiered: {{ data.premiered }}
                    <br>
                    Rating: {{ data.rating }}
                    <br>
                    Seasons: {{ data.seasons }}
                    <br>
                    Episodes: {{ data.episodes }}
                    <br>
                    Infos: <a :href="data.scraperLink" target="_blank">{{ data.scraperName }}</a>
                </q-card-section>

                <q-card-section v-if="mediaType == 3" class="section">
                    <router-link :to="{ name: 'movie', params: { id: data.id } }"><h6 class="q-my-lg">{{ data.title }}</h6></router-link>
                    <br>
                    Type: Movie
                    <br>
                    Premiered: {{ data.premiered }}
                    <br>
                    Rating: {{ data.rating }}
                    <br>
                    Infos: <a :href="data.scraperLink" target="_blank">{{ data.scraperName }}</a>
                </q-card-section>
            </q-card-section>
        </q-card>
    </div>
</template>

<style scoped>
.hImg {
    width: 90%;
    height: 90%;
}
.vImg {
    width: 11rem;
    height: 15rem
}
a {
    color: #FFFFFF;
    text-decoration: none;
}
.cardStyle {
    height: 50px;
}
.section {
    padding: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
}
</style>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'mediaCard',
  data () {
    return {
      data: {},
      data2: {},
      vertical: true
    }
  },
  mounted () {
    if (this.mediaType === 1) {
      // tvs episode
      this.$apiCall('tvs/episode/' + this.mediaData)
        .then((response) => {
          this.data = response
          this.$apiCall('tvs/' + response.idShow)
            .then((resp) => {
              this.data2 = resp
            })
        })
      this.vertical = false
    } else if (this.mediaType === 2) {
      // tvs
      this.$apiCall('tvs/' + this.mediaData)
        .then((response) => {
          this.data = response
        })
      this.vertical = true
    } else if (this.mediaType === 3) {
      // movie
      this.$apiCall('movie/' + this.mediaData)
        .then((response) => {
          this.data = response
        })
      this.vertical = true
    }
  },
  props: {
    mediaType: {
      required: true
    },
    mediaData: {
      required: true
    }
  }
})
</script>
