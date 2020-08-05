<template>
    <div>
        <q-card>
            <q-img :src="image" basic>
                <div class="absolute-bottom text-h6">
                    {{ strDate }} | {{ title }}
                </div>
            </q-img>
        </q-card>
        <q-tooltip anchor="top middle" self="bottom middle">
            <strong>{{ showTitle }}: S{{ season }}E{{ episode }}</strong>
            <br>
          {{ overview }}
        </q-tooltip>
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'episodeCard',
  computed: {
    image: function () {
      if (this.img !== null) {
        if (this.img.substring(0, 4) === 'http') {
          return this.img
        } else {
          return this.$store.getters.imageEndpoint + this.img
        }
      } else {
        return '/images/undefined_h.png'
      }
    },
    strDate: function () {
      return this.date.substring(0, 16)
    }
  },
  props: {
    title: {
      required: true
    },
    overview: {
      required: true
    },
    img: {
      required: true
    },
    episode: {
      required: true
    },
    season: {
      required: true
    },
    date: {
      required: true
    },
    showTitle: {
      required: true
    }
  }
})
</script>
