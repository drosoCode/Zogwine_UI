<template>
  <div class="q-px-md q-pt-md">
      <q-card>
        <q-card-section horizontal>
          <q-img
            class="col-5 scraperIcon"
            :src="icon"
          />

          <q-card-section>
            <div class="text-h5 q-mt-sm q-mb-xs">{{ title }}</div>
            <div class="text-caption text-grey">
              Premiered: {{ date }}<br>
              Scraper: {{ scraper }}<br>
              <span v-if="mediaType === 2">In Production: {{ in_production }}</span>
              <br><br>
              {{ overview }}
            <q-btn color="teal" class="full-width" label="Select" @click="select"/>
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
</template>

<style scoped>
.scraperIcon {
  height: 18rem;
  width: 12rem;
}
</style>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'scraperItem',
  props: {
    title: {
      required: true
    },
    overview: {
      required: true
    },
    icon: {
      required: true
    },
    scraper: {
      required: true
    },
    in_production: {
      required: false,
      default: false
    },
    date: {
      required: true
    },
    id: {
      required: true
    },
    idMedia: {
      required: true
    },
    mediaType: {
      required: true
    }
  },
  methods: {
    select: function () {
      this.$q.notify({
        message: 'Selected',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      if (this.mediaType === 2) {
        this.$apiCall('/tvs/show/' + this.idMedia + '/select/' + this.id, null, 'POST')
      } else if (this.mediaType === 3) {
        this.$apiCall('movies/setID?idMovie=' + this.idMedia + '&id=' + this.id)
      }
      this.$emit('selected')
    }
  }
})
</script>
