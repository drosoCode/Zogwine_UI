<template>
    <q-card>
        <q-card-section>
          <div class="text-h6">{{ title }}</div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          Premiered: {{ new Date(premiered).toISOString().split('T')[0] }} <br>
          Rating: {{ rating }} <br>
          Scraper: <a :href="scraperLink" target="_blank">{{ scraperName }}</a> <br>
          Seasons: {{ seasons }} <br>
          Episodes: {{ episodes }} <br>
          <br>
          <q-chip square :color="chipColor" text-color="white" :icon="watchIcon">Watched {{ watchedEpisodes }} / {{ episodes }}</q-chip>
          <br>
          <br>
          {{ overview }}
        </q-card-section>
      </q-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'tvsDesc',
  computed: {
    chipColor: function () {
      if (this.watchedEpisodes === 0) {
        return 'red'
      } else if (this.watchedEpisodes === this.episodes) {
        return 'teal'
      } else {
        return 'orange'
      }
    },
    watchIcon: function () {
      if (this.watchedEpisodes === 0) {
        return 'clear'
      } else if (this.watchedEpisodes === this.episodes) {
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
    rating: {
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
    seasons: {
      required: true
    },
    episodes: {
      required: true
    },
    watchedEpisodes: {
      required: true
    }
  }
})
</script>
