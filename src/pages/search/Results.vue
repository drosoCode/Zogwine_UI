<template>
  <q-page>
    <div class="row wrap justify-around">
      <mediaCard :mediaType="mediaType" :mediaData="mediaData" class="q-px-md q-pt-md col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"/>
      <!--
      <mediaCard :mediaType="2" :mediaData="163" class="q-px-md q-pt-md col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"/>
      <mediaCard :mediaType="1" :mediaData="17211" class="q-px-md q-pt-md col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"/>
      <mediaCard :mediaType="3" :mediaData="600" class="q-px-md q-pt-md col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"/>
      <mediaCard :mediaType="3" :mediaData="238" class="q-px-md q-pt-md col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"/>
      -->
   </div>
  </q-page>
</template>

<script>
import Vue from 'vue'
import mediaCard from '../components/mediaCard'

export default Vue.extend({
  components: { mediaCard },
  data () {
    return {
      mediaType: -1,
      mediaData: ''
    }
  },
  mounted () {
  },
  methods: {
  }
})
</script>
