<template>
  <div class="q-pa-md" v-if="show">
      <q-card class="bg-teal-10 row">
        <h6>{{ path }}</h6>
        <scraperItem class="col-lg-6 col-12" v-for="(item, index) in scrapers" :id="index" :mediaType="mediaType" :idMedia="idMedia" :title="item.title" :icon="item.icon" :scraper="item.scraperName" :in_production="item.in_production" :date="item.premiered" :overview="item.overview" v-on:selected="select"/>
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
    idMedia: {
      type: Number,
      required: true
    },
    mediaType: {
      type: Number,
      required: true
    },
    path: {
      type: String,
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
