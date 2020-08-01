<template>
  <q-page class="row justify-center items-center">
    <div class="row wrap justify-around">
      <videoInfo :mediaType="$route.params.mediaType" :mediaData="$route.params.data" v-if="isVideo"/>
   </div>
  </q-page>
</template>

<script>
import Vue from 'vue'
import videoInfo from './components/videoInfo'

export default Vue.extend({
  components: { videoInfo },
  computed: {
    isVideo: function () {
      const mt = this.$route.params.mediaType.toString()
      if (mt === '1' || mt === '3') {
        return true
      }
      return false
    }
  }
})
</script>
