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
        <scraperItem class="col-lg-6 col-12" v-for="(item, index) in items" :key="index" :id="index" :mediaType="mediaType" :mediaData="mediaData" :title="item.title" :icon="item.icon" :scraper="item.scraperName" :link="item.scraperLink" :date="item.premiered" :overview="item.overview" v-on:selected="select"/>
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
      title: '',
      newTitle: null,
      items: []
    }
  },
  props: {
    mediaData: {
      required: true
    },
    mediaType: {
      required: true
    }
  },
  mounted () {
    this.$apiCall('scraper/result/' + this.mediaType + '/' + this.mediaData)
      .then((response) => {
        this.items = response.data
        this.title = response.path
      })
  },
  methods: {
    select: function () {
      this.show = false
    },
    setNewSearch: function () {
      this.$apiCall(this.mediaType + '/' + this.mediaData, { title: this.newTitle, updateMode: 1 }, 'PUT')
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
