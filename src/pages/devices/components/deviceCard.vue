<template>
    <div class="q-px-md q-pt-md col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2">
        <q-card class="dev_card">
            <q-img :src="'/images/'+$attrs.type+'.png'" class="dev_img" />
              <q-linear-progress :value="playedPercent" :color="barColor" />

            <q-card-section>
                <div class="row no-wrap items-center justify-between text-h5">
                    {{ $attrs.name }} | {{ $attrs.type }}
                    <div>
                        <q-chip square color="teal" text-color="white" icon="done" v-if="$attrs.enabled && $attrs.available">
                          Online
                        </q-chip>
                        <q-chip square color="red" text-color="white" icon="clear" v-if="$attrs.enabled && !$attrs.available">
                          Offline
                        </q-chip>
                        <q-chip square color="grey-8" text-color="white" icon="block" v-if="!$attrs.enabled">
                          Disabled
                        </q-chip>
                    </div>
                </div>
            </q-card-section>

            <q-card-section class="q-pt-none" v-if="$attrs.enabled && $attrs.available">
                <div class="text-subtitle1">
                  {{ statusLabel }}
                </div>
                <div class="text-caption text-grey" v-if="playingMedia !== null">
                    {{ playingMedia }}
                </div>
            </q-card-section>

            <q-separator v-if="$attrs.enabled && $attrs.available && this.status !== 0 && this.status !== null" />
            <q-card-actions align="right" v-if="$attrs.enabled && $attrs.available && this.status !== 0 && this.status !== null">
                <q-btn flat round color="teal" icon="play_arrow" v-if="functions.includes('play') && this.status === 1" @click="callDeviceFunction('play')"/>
                <q-btn flat round color="orange" icon="pause" v-if="functions.includes('pause') && this.status === 2" @click="callDeviceFunction('pause')"/>
                <q-btn flat round color="red" icon="stop" v-if="functions.includes('stop') && this.status !== 0 && this.status !== null" @click="callDeviceFunction('stop')" />
            </q-card-actions>
        </q-card>
    </div>
</template>

<style scoped>
.body--dark .dev_card:hover {
    box-shadow: 6px 10px #000000;
}
.dev_img {
  height: 100%;
  width: 100%;
  max-height: 10rem;
}
</style>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'deviceCard',
  data () {
    return {
      functions: [],
      status: null,
      position: null,
      length: null,
      playingMedia: null
    }
  },
  methods: {
    updateStatus: function () {
      if (this.functions.includes('position')) {
        this.$apiCall('device/position?idDevice=' + this.$attrs.id)
          .then((response) => {
            this.position = response
          })
      }
      if (this.functions.includes('length')) {
        this.$apiCall('device/length?idDevice=' + this.$attrs.id)
          .then((response) => {
            this.length = response
          })
      }
      if (this.functions.includes('status')) {
        this.$apiCall('device/status?idDevice=' + this.$attrs.id)
          .then((response) => {
            this.status = response
          })
      }
      if (this.functions.includes('playingMedia')) {
        this.$apiCall('device/playingMedia?idDevice=' + this.$attrs.id)
          .then((response) => {
            this.playingMedia = response
          })
      }
    },
    callDeviceFunction: function (name) {
      this.$apiCall('device/' + name + '?idDevice=' + this.$attrs.id)
        .then((response) => {
        })
    }
  },
  computed: {
    playedPercent: function () {
      if (this.$attrs.enabled === 1 && this.$attrs.available === 1 && this.position !== null && this.length !== null) {
        return this.position / this.length
      } else {
        return 100
      }
    },
    barColor: function () {
      if (!this.$attrs.available) {
        return 'red'
      }
      if (!this.$attrs.enabled) {
        return 'grey-8'
      }
      if (this.status === 2) {
        return 'teal'
      } else if (this.status === 1) {
        return 'orange'
      } else {
        return 'red'
      }
    },
    statusLabel: function () {
      let time = ''
      if (this.position !== null) {
        time = ' | ' + Math.round(this.position / 60)
      }
      if (this.length !== null) {
        time += ' / ' + Math.round(this.length / 60)
      }
      if (this.status === 0) {
        return 'STOPPED'
      } else if (this.status === 1) {
        return 'PAUSED' + time
      } else if (this.status === 2) {
        return 'PLAYING' + time
      } else {
        return 'UNKNOWN'
      }
    }
  },
  mounted () {
    this.$apiCall('device/functions?idDevice=' + this.$attrs.id)
      .then((response) => {
        this.functions = response
        this.updateStatus()
      })
  },
  props: [{
    id: {
      required: true
    },
    name: {
      required: true
    },
    type: {
      required: true
    },
    available: {
      required: true
    },
    enabled: {
      required: true
    }
  }]
})
</script>
