<template>
  <q-page class="row justify-center items-center">
    <div class="row wrap justify-around">
      <videoPlayer :mediaType="$route.params.mediaType" :mediaData="$route.params.data" @duration="(val) => { this.duration = val }" @time="(val) => { this.position = val }" @status="(val) => { this.status = val }" :status="status" :position="setPosition" v-if="isVideo"/>
      <mediaSession :mediaType="$route.params.mediaType" :mediaData="$route.params.data" :status="status" :duration="duration" :position="position" @play="status = 2" @pause="status = 1" @stop="status = 0" @seek="(val) => { this.setPosition = val }" />
   </div>
  </q-page>
</template>

<script>
import Vue from 'vue'
import videoPlayer from './components/videoPlayer'
import mediaSession from './components/mediaSession'

export default Vue.extend({
  components: { videoPlayer, mediaSession },
  data () {
    return {
      status: 2,
      setPosition: 0,
      position: 0,
      duration: 0
    }
  },
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
