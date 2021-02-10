<template>
  <div class="q-pa-md" v-if="show">
      <q-card class="bg-teal-10 row" style="min-height: 5rem">

        <div class="row" style="height: 2rem;">
          <span class="subtitle-2" style="height: 3rem">{{ title }}</span>
          &nbsp;&nbsp;
          <q-input
            v-model="newTitle"
            label="New Title"
            style="height: 3rem !important"
          />
          <q-btn icon="search" color="primary" style="height: 3rem" @click="setNewSearch"/>
        </div>
        <br>
        <scraperItem class="col-lg-6 col-12" v-for="(item, index) in scrapers" :key="index" :id="index" :mediaType="mediaType" :idMedia="idMedia" :title="item.title" :icon="item.icon" :scraper="item.scraperName" :in_production="item.in_production" :date="item.premiered" :overview="item.overview" v-on:selected="select"/>
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
      show: true,
      newTitle: null
    }
  },
  props: {
    data: {
      type: String,
      required: false
    },
    idMedia: {
      type: Number,
      required: true
    },
    mediaType: {
      type: Number,
      required: true
    },
    title: {
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
    },
    setNewSearch: function () {
      if (this.mediaType === 2) {
        this.$apiCall('/tvs/' + this.idMedia + '/scanTitle', { title: this.newTitle }, 'PUT')
      } else if (this.mediaType === 3) {
        this.$apiCall('/movie/' + this.idMedia + '/scanTitle', { title: this.newTitle }, 'PUT')
      }
      this.$q.notify({
        message: 'Title Updated',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.show = false
    }
  }
})
</script>
