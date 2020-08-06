<template>
    <div>
      <router-link :to="link">
        <q-card class="mov_card">
            <q-img class="mov_img" :src="$store.getters.imageEndpoint + img">
                <div class="absolute-bottom">
                    <div class="text-h6">{{ title }}</div>
                    <div class="text-subtitle2">{{ premiered }}</div>
                </div>
            </q-img>
            <q-linear-progress :value="100" :color="barColor"/>
        </q-card>
      </router-link>
    </div>
</template>

<style scoped>
.body--dark .mov_card:hover {
    box-shadow: 6px 10px #000000;
}
.mov_card {
    height: 100%
}
.mov_img {
    height: 100%;
}
</style>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'movCard',
  computed: {
    barColor: function () {
      if (this.watchCount > 0) {
        return 'teal'
      } else {
        return 'red'
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
      required: true
    },
    link: {
      required: true
    },
    premiered: {
      type: String,
      required: true
    },
    watchCount: {
      type: Number,
      required: true
    }
  }
})
</script>
