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
              Scraper: <a :href="link">{{ scraper }}</a><br>
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
    link: {
      required: true
    },
    date: {
      required: true
    },
    id: {
      required: true
    },
    mediaData: {
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
      this.$apiCall('scraper/select/' + this.mediaType + '/' + this.mediaData + '/' + this.id, null, 'POST')
      this.$emit('selected')
    }
  }
})
</script>
