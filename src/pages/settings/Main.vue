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
                        <q-btn color="orange" label="Refresh TVS Library" icon="refresh" class="q-ma-sm" @click="refreshTVS" :loading="threadStatus.tvs && runningThread" :disable="!threadStatus.tvs && runningThread">
                          <template v-slot:loading>
                            <q-spinner-gears class="on-left" />
                            Loading...
                          </template>
                        </q-btn>
                        <q-btn color="orange" label="Refresh Movies Library" icon="refresh" class="q-ma-sm" @click="refreshMovies" :loading="threadStatus.movies && runningThread" :disable="!threadStatus.movies && runningThread">
                          <template v-slot:loading>
                            <q-spinner-gears class="on-left" />
                            Loading...
                          </template>
                        </q-btn>
                        <q-btn color="orange" label="Refresh Upcoming Episodes" icon="refresh" class="q-ma-sm" @click="refreshUEp" :loading="threadStatus.upEpisodes && runningThread" :disable="!threadStatus.upEpisodes && runningThread">
                          <template v-slot:loading>
                            <q-spinner-gears class="on-left" />
                            Loading...
                          </template>
                        </q-btn>
                        <q-btn color="orange" label="Refresh Cache" icon="refresh" class="q-ma-sm" @click="refreshCache" :loading="threadStatus.cache && runningThread" :disable="!threadStatus.cache && runningThread">
                          <template v-slot:loading>
                            <q-spinner-gears class="on-left" />
                            Loading...
                          </template>
                        </q-btn>
                        <q-btn color="orange" label="Refresh People" icon="refresh" class="q-ma-sm" @click="refreshPeople" :loading="threadStatus.people && runningThread" :disable="!threadStatus.people && runningThread">
                          <template v-slot:loading>
                            <q-spinner-gears class="on-left" />
                            Loading...
                          </template>
                        </q-btn>
                    </q-card-section>
                </q-card>
            </q-tab-panel>

            <q-tab-panel name="scrapers">
                <div>
                    <scraperCard v-for="tvs in scraper_tvs" :key="tvs.id" :data="tvs.multipleResults" :mediaType="2" :idMedia="tvs.id" :path="tvs.path"/>
                    <scraperCard v-for="mov in scraper_movies" :key="mov.id" :data="mov.multipleResults" :mediaType="3" :idMedia="mov.id" :path="mov.path"/>
                </div>
            </q-tab-panel>

            <q-tab-panel name="logs">
                <div>
                  &nbsp;&nbsp;&nbsp;
                  <q-btn color="orange" icon="refresh" label="Refresh Logs" @click="refreshLogs" />
                  <br><br>
                   <q-scroll-area style="height: 35rem;" ref="logScroll">
                      <logLine v-for="line in logs" :key="line" :data="line"/>
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
      scraper_tvs: [],
      scraper_movies: [],
      threadStatus: {
        tvs: false,
        movies: false,
        upEpisodes: false,
        cache: false,
        people: false
      },
      runningThread: false
    }
  },
  mounted () {
    this.$apiCall('core/getThreads')
      .then((response) => {
        this.threadStatus = response
        this.runningThread = Object.values(response).includes(true)
      })
    this.$apiCall('core/getLogs?amount=50')
      .then((response) => {
        this.logs = response
      })
    this.$apiCall('tvs/getShowsMultipleResults')
      .then((response) => {
        this.scraper_tvs = response
      })
    this.$apiCall('movies/getMultipleResults')
      .then((response) => {
        this.scraper_movies = response
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
    refreshPeople: function () {
      this.$q.notify({
        message: 'Refreshing People',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('core/runPeopleScan')
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
