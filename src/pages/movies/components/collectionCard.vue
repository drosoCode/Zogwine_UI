<template>
    <div>
      <router-link :to="link">
        <q-card class="c_card">
            <q-img class="c_img" :src="$store.getters.imageEndpoint + img">
                <div class="absolute-bottom">
                    <div class="text-h6">{{ title }}</div>
                    <div class="text-subtitle2">{{ watchedMovies }} / {{ movieCount }}</div>
                </div>
            </q-img>
            <q-linear-progress :value="watchedPercent" :color="barColor"/>
        </q-card>
      </router-link>
    </div>
</template>

<style scoped>
.body--dark .c_card:hover {
    box-shadow: 6px 10px #000000;
}
.c_card {
    height: 100%
}
.c_img {
    height: 100%;
}
</style>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'collectionCard',
  computed: {
    watchedPercent: function () {
      const dat = this.watchedMovies / this.movieCount
      if (dat === 0) {
        return 100
      } else {
        return dat
      }
    },
    barColor: function () {
      const dat = this.watchedMovies / this.movieCount
      if (dat === 1) {
        return 'teal'
      } else if (dat === 0) {
        return 'red'
      } else {
        return 'orange'
      }
    }
  },
  props: {
    title: {
      required: true
    },
    img: {
      required: false
    },
    link: {
      required: true
    },
    movieCount: {
      required: true
    },
    watchedMovies: {
      required: true
    }
  }
})
</script>
