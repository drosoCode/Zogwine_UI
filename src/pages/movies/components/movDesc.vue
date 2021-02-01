<template>
    <q-card>
        <q-card-section>
          <div class="text-h6">{{ title }}</div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          Premiered: {{ premiered }} <br>
          Rating: {{ rating }} <br>
          Scraper: <a :href="scraperLink" target="_blank">{{ scraperName }}</a> <br>
          <br>
          <q-chip square :color="chipColor" text-color="white" :icon="watchIcon">Watched: {{ watchCount }}</q-chip>
          <q-btn color="secondary" label="Toggle" @click="toggleStatus" size="sm" />
          <br>
          <br>
          {{ overview }}
        </q-card-section>
      </q-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'movDesc',
  computed: {
    chipColor: function () {
      if (parseInt(this.watchCount) === 0) {
        return 'red'
      } else {
        return 'teal'
      }
    },
    watchIcon: function () {
      if (parseInt(this.watchCount) === 0) {
        return 'clear'
      } else {
        return 'done'
      }
    }
  },
  methods: {
    toggleStatus: function () {
      this.$apiCall('movie/' + this.$route.params.id + '/status', null, 'PUT')
        .then((response) => {
          this.$q.notify({
            message: 'Movie status updated',
            icon: 'done',
            position: 'bottom-left',
            color: 'teal'
          })
          if (parseInt(this.watchCount) > 0) {
            this.watchCount = 0
          } else {
            this.watchCount = 1
          }
        })
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
    watchCount: {
      required: true
    }
  }
})
</script>
