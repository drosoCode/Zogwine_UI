<template>
  <div class="q-pa-md" v-if="show">
      <q-card class="bg-teal-10 row">
        <scraperItem class="col-lg-6 col-12" v-for="(item, index) in scrapers" :id="index" :idShow="idShow" :title="item.title" :icon="item.icon" :scraper="item.scraperName" :in_production="item.in_production" :date="item.premiered" :overview="item.overview" v-on:selected="select"/>
      </q-card>
    </div>
</template>

<script>
import scraperItem from 'pages/settings/components/scraperItem.vue'

import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  components: { scraperItem },
  name: 'scraperCard',
  data () {
    return {
      show: true
    }
  },
  props: {
    data: {
      type: String,
      required: true
    },
    idShow: {
      type: Number,
      required: true
    }
  },
  computed: {
    scrapers: function () {
      return JSON.parse(this.data)
    }
  },
  methods: {
    select: function () {
      this.show = false
    }
  }
})
</script>
