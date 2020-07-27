<template>
    <div class="q-px-md q-pt-md col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2">
      <router-link :to="link">
        <q-card class="tvs_card">
            <q-img class="tvs_img" :src="$store.getters.imageEndpoint + img">
                <div class="absolute-bottom">
                    <div class="text-h6">{{ title }}</div>
                    <div class="text-subtitle2">{{ watchedEp }} / {{ nbEp }}</div>
                </div>
            </q-img>
            <q-linear-progress :value="watchedPercent" :color="barColor"/>
        </q-card>
      </router-link>
    </div>
</template>

<style scoped>
.body--dark .tvs_card:hover {
    box-shadow: 6px 10px #000000;
}
.tvs_card {
    height: 100%
}
.tvs_img {
    height: 100%;
}
</style>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'tvsCard',
  computed: {
    watchedPercent: function () {
      return this.watchedEp / this.nbEp
    },
    barColor: function () {
      const dat = this.watchedEp / this.nbEp
      if (dat === 1) {
        return 'teal'
      } else {
        return 'orange'
      }
    }
  },
  props: {
    title: {
      type: String,
      required: true
    },
    img: {
      type: String,
      required: false,
      default: 'https://cdn.quasar.dev/img/parallax1.jpg'
    },
    link: {
      required: true
    },
    nbEp: {
      type: Number,
      required: true
    },
    watchedEp: {
      type: Number,
      required: true
    }
  }
})
</script>
