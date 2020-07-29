<template>
    <div class="q-px-md q-pt-md col-xs-6 col-sm-5 col-md-3 col-lg-3 col-xl-2">
      <router-link :to="link">
        <q-card class="epCard">
            <q-img :src="image" basic>
                <div class="absolute-bottom text-h6">
                    E{{ episode }} - {{ title }}
                </div>
            </q-img>
            <q-linear-progress value="100" :color="barColor"/>
        </q-card>
      </router-link>
    </div>
</template>

<style scoped>
.body--dark .epCard:hover {
    box-shadow: 6px 10px #000000;
}/*
.epCardH {
    height: 14em;
    width: 18em;
}*/
</style>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'episodeCard',
  computed: {
    barColor: function () {
      if (this.watchCount > 0) {
        return 'teal'
      } else {
        return 'red'
      }
    },
    image: function () {
      if (this.img !== null) {
        return this.$store.getters.imageEndpoint + this.img
      } else {
        return this.$store.getters.imageEndpoint + '/static/icons/undefinedEp.png'
      }
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
      required: false,
      default: 'https://cdn.quasar.dev/img/parallax1.jpg'
    },
    link: {
      required: true
    },
    episode: {
      required: true
    },
    watchCount: {
      required: true
    }
  }
})
</script>
