<template>
  <q-page class="row justify-center items-center">
    <div v-if="!remotePlayer">
      <q-card class="row justify-center items-center text-white" style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%); width: 30rem; height:20rem;">
        <q-card-section>
          <div class="text-h6">Nothing Playing</div>
        </q-card-section>
      </q-card>
      <div class="row justify-center items-center q-mt-lg" v-if="$store.getters.receive">
        <q-btn-dropdown
          split
          color="primary"
          label="Remote Player Mode"
          icon="airplay"
          @click="remotePlayer=true"
        >
          <q-list v-if="$store.getters.cast">
            <q-item clickable v-close-popup @click="remotePlayerName=dev.address; remotePlayer=true;" v-for="dev in devices" :key="dev.id">
              <q-item-section avatar>
                <q-avatar icon="cast" color="primary" text-color="white" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ dev.address }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

    </div>
    <remotePlayer v-else :name="remotePlayerName"/>
  </q-page>
</template>

<script>
import Vue from 'vue'
import remotePlayer from './components/remotePlayer'
export default Vue.extend({
  components: { remotePlayer },
  data () {
    return {
      remotePlayer: 0,
      remotePlayerName: 'self',
      devices: []
    }
  },
  mounted () {
    if (this.$store.getters.cast) {
      this.$apiCall('device')
        .then((response) => {
          response.forEach(dev => {
            if (dev.enabled === 1 && dev.available === false && dev.type === 'web' && dev.address !== 'self') {
              this.devices.push(dev)
            }
          })
        })
    }
  }
})
</script>
