<template>
    <q-card>
        <q-card-section>
          <div class="text-h6">Tags</div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
            <div class="q-pa-md" style="max-width: 350px">
                <q-list bordered>
                    <q-item clickable v-ripple>
                        <q-item-section avatar>
                        <q-avatar rounded>
                            <q-icon color="primary" name="people" />
                        </q-avatar>
                        </q-item-section>
                        <q-item-section>People</q-item-section>
                    </q-item>

                    <div v-for="item in tags" :key="item.idTag">
                        <q-separator />
                        <q-item clickable v-ripple>
                            <q-item-section avatar>
                            <q-avatar rounded>
                                <img :src="$store.getters.imageEndpoint + item.icon" v-if="item.icon !== null">
                                <q-icon color="primary" :name="getIcon(item.name)" v-if="item.icon === null" />
                            </q-avatar>
                            </q-item-section>
                            <q-item-section>{{ capitalize(item.name) }}: {{ item.value }}</q-item-section>
                        </q-item>
                    </div>
                </q-list>
            </div>
        </q-card-section>
    </q-card>
</template>

<script>
import { format } from 'quasar'
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'tags',
  data () {
    return {
      tags: []
    }
  },
  methods: {
    capitalize: function (name) {
      return format.capitalize(name)
    },
    getIcon: function (name) {
      if (name === 'genre') {
        return 'leaderboard'
      } else if (name === 'network') {
        return 'wifi_tethering'
      } else if (name === 'country') {
        return 'flag'
      } else if (name === 'production') {
        return 'widgets'
      } else {
        return 'close'
      }
    }
  },
  mounted () {
    this.$apiCall('tvs/getTags?idShow=' + this.idShow)
      .then((response) => {
        this.tags = response
      })
  },
  props: {
    idShow: {
      required: true
    }
  }
})
</script>
