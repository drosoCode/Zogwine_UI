<template>
  <q-page class="row wrap justify-around q-mb-lg">
    <deviceCard class="q-px-md q-pt-md col-xs-12 col-sm-6 col-md-4 col-lg-3 col-xl-3" v-for="item in devices" :key="item.id" :id="item.id" :name="item.name" :type="item.type" :available="item.available" :enabled="item.enabled"></deviceCard>
  </q-page>
</template>

<script>
import Vue from 'vue'

import deviceCard from 'pages/devices/components/deviceCard.vue'

export default Vue.extend({
  components: { deviceCard },
  data () {
    return {
      devices: []
    }
  },
  mounted () {
    this.$apiCall('device')
      .then((response) => {
        this.devices = response
      })
  }
})
</script>
