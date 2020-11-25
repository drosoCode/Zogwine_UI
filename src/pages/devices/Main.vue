<template>
  <q-page class="row wrap justify-around q-mb-lg">
    <deviceCard v-for="item in devices" :key="item.id" :id="item.id" :name="item.name" :type="item.type" :available="item.available" :enabled="item.enabled"></deviceCard>
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
    this.$apiCall('device/list')
      .then((response) => {
        this.devices = response
      })
  }
})
</script>
