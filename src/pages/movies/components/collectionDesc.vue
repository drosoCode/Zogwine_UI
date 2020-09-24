<template>
    <q-card>
        <q-card-section>
          <div class="text-h6">{{ title }}</div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          Premiered: {{ premiered }} <br>
          Movies: {{ movieCount }} <br>
          Scraper: <a :href="scraperLink" target="_blank">{{ scraperName }}</a> <br>
          <br>
          <q-chip square :color="chipColor" text-color="white" :icon="watchIcon">Watched {{ watchedMovies }} / {{ movieCount }}</q-chip>
          <br>
          <br>
          {{ overview }}
        </q-card-section>
      </q-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'collectionDesc',
  computed: {
    chipColor: function () {
      if (this.watchedMovies === 0) {
        return 'red'
      } else if (this.watchedMovies === this.movieCount) {
        return 'teal'
      } else {
        return 'orange'
      }
    },
    watchIcon: function () {
      if (this.watchedMovies === 0) {
        return 'clear'
      } else if (this.watchedMovies === this.movieCount) {
        return 'done'
      } else {
        return 'schedule'
      }
    }
  },
  props: {
    premiered: {
      required: true
    },
    title: {
      required: true
    },
    overview: {
      required: true
    },
    scraperLink: {
      required: true
    },
    scraperName: {
      required: true
    },
    watchedMovies: {
      required: true
    },
    movieCount: {
      required: true
    }
  }
})
</script>
