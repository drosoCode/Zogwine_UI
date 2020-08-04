<template>
  <q-page class="row justify-center items-center">
    <div class="row wrap justify-around">
      <videoPlayer :mediaType="$route.params.mediaType" :mediaData="$route.params.data" v-if="isVideo"/>
   </div>
  </q-page>
</template>

<script>
import Vue from 'vue'
import videoPlayer from './components/videoPlayer'

export default Vue.extend({
  components: { videoPlayer },
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
