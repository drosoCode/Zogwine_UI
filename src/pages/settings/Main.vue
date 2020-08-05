<template>
  <q-page>
    <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
          inline-label
        >
          <q-tab name="config" label="Config" icon="settings" />
          <q-tab name="scrapers" label="Scrapers" icon="create" />
          <q-tab name="logs" label="Logs" icon="subject" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>

            <q-tab-panel name="config">
                <q-card>
                    <q-card-section>
                        <h5>Actions</h5>
                        <q-btn color="orange" label="Refresh TVS Library" icon="refresh" @click="refreshTVS" />&nbsp;
                        <q-btn color="orange" label="Refresh Movies Library" icon="refresh" @click="refreshMovies" />&nbsp;
                        <q-btn color="orange" label="Refresh Upcoming Episodes" icon="refresh" @click="refreshUEp" />&nbsp;
                        <q-btn color="orange" label="Refresh Cache" icon="refresh" @click="refreshCache" />&nbsp;
                        <q-btn color="orange" label="Refresh Persons" icon="refresh" @click="refreshPersons" />&nbsp;
                    </q-card-section>
                </q-card>
            </q-tab-panel>

            <q-tab-panel name="scrapers">
                <div>
                    <scraperCard v-for="tvs in scraper_tvs" :data="tvs.multipleResults" :idShow="tvs.id"/>
                </div>
            </q-tab-panel>

            <q-tab-panel name="logs">
                <div>
                  &nbsp;&nbsp;&nbsp;
                  <q-btn color="orange" icon="refresh" label="Refresh Logs" @click="refreshLogs" />
                  <br><br>
                   <q-scroll-area style="height: 35rem;" ref="logScroll">
                      <logLine v-for="line in logs" :data="line"/>
                   </q-scroll-area>
                </div>
            </q-tab-panel>

        </q-tab-panels>
  </q-page>
</template>

<script>
import Vue from 'vue'

import logLine from 'pages/settings/components/logLine.vue'
import scraperCard from 'pages/settings/components/scraperCard.vue'

export default Vue.extend({
  components: { logLine, scraperCard },
  data () {
    return {
      logs: '',
      tab: 'config',
      scraper_tvs: []
    }
  },
  mounted () {
    this.$apiCall('core/getLogs?amount=50')
      .then((response) => {
        this.logs = response
      })
    this.$apiCall('tvs/getShowsMultipleResults')
      .then((response) => {
        this.scraper_tvs = response
      })
  },
  methods: {
    refreshTVS: function () {
      this.$q.notify({
        message: 'Scanning TVS Library',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('tvs/runScan')
    },
    refreshMovies: function () {
      this.$q.notify({
        message: 'Scanning Movies Library',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('movies/runScan')
    },
    refreshUEp: function () {
      this.$q.notify({
        message: 'Scanning Upcoming Episodes',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('tvs/runUpcomingScan')
    },
    refreshCache: function () {
      this.$q.notify({
        message: 'Refreshing Cache',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('core/refreshCache')
    },
    refreshPersons: function () {
      this.$q.notify({
        message: 'Refreshing Persons',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('core/runPersonsScan')
    },
    refreshLogs: function () {
      this.$apiCall('core/getLogs?amount=50')
        .then((response) => {
          this.logs = response
        })
      this.$refs.logScroll.setScrollPosition(this.$refs.logScroll.getScrollTarget().scrollHeight)
    }
  }
})
</script>
