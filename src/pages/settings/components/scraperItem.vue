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
              In Production: {{ in_production }}<br><br>
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
      type: String,
      required: true
    },
    overview: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    scraper: {
      type: String,
      required: true
    },
    in_production: {
      type: Boolean,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    id: {
      type: Number,
      required: true
    },
    idShow: {
      type: Number,
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
      this.$apiCall('tvs/setID?idShow=' + this.idShow + '&id=' + this.id)
      this.$emit('selected')
    }
  }
})
</script>
