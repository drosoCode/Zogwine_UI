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
          <q-tab name="content" label="Content" icon="view_list" />
          <q-tab name="users" label="Users" icon="people" />
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
                        <q-btn color="orange" label="Refresh Movies Library" icon="refresh" class="q-ma-sm" @click="refreshMovies" :loading="threadStatus.movie && runningThread" :disable="!threadStatus.movie && runningThread">
                          <template v-slot:loading>
                            <q-spinner-gears class="on-left" />
                            Loading...
                          </template>
                        </q-btn>
                        <q-btn color="orange" label="Refresh Upcoming Episodes" icon="refresh" class="q-ma-sm" @click="refreshUEp" :loading="threadStatus.upcomingEpisode && runningThread" :disable="!threadStatus.upcomingEpisode && runningThread">
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
                        <q-btn color="orange" label="Refresh People" icon="refresh" class="q-ma-sm" @click="refreshPeople" :loading="threadStatus.person && runningThread" :disable="!threadStatus.person && runningThread">
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
                    <scraperCard v-for="tvs in scraper_tvs" :key="tvs.id" :data="tvs.multipleResults" :mediaType="2" :idMedia="tvs.id" :title="tvs.title"/>
                    <scraperCard v-for="mov in scraper_movies" :key="mov.id" :data="mov.multipleResults" :mediaType="3" :idMedia="mov.id" :title="mov.title"/>
                </div>
            </q-tab-panel>

            <q-tab-panel name="content">
              <q-bar>
                <div class="cursor-pointer" @click="contentType = 2">TV Shows</div>
                <div class="cursor-pointer" @click="contentType = 3">Movies</div>
              </q-bar>
                <div>
                    <contentManager :type="contentType"/>
                </div>
            </q-tab-panel>

            <q-tab-panel name="users">
                <div>
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
import contentManager from 'pages/settings/components/contentManager.vue'

export default Vue.extend({
  components: { logLine, scraperCard, contentManager },
  data () {
    return {
      logs: '',
      tab: 'config',
      scraper_tvs: [],
      scraper_movies: [],
      threadStatus: {
        tvs: false,
        movie: false,
        upcomingEpisode: false,
        cache: false,
        person: false
      },
      runningThread: false,
      statusInterval: null,
      contentType: 2
    }
  },
  mounted () {
    this.$apiCall('core/scan/status')
      .then((response) => {
        this.threadStatus = response
        this.runningThread = Object.values(response).includes(true)
      })
    this.$apiCall('core/log/50')
      .then((response) => {
        this.logs = response
      })
    this.$apiCall('tvs/scan/result')
      .then((response) => {
        this.scraper_tvs = response
      })
    this.$apiCall('movie/scan/result')
      .then((response) => {
        this.scraper_movies = response
      })
  },
  destoyed: function () {
    if (this.statusInterval != null) {
      clearInterval(this.statusInterval)
    }
  },
  methods: {
    refreshStatus: function () {
      this.$apiCall('core/scan/status')
        .then((response) => {
          this.threadStatus = response
          this.runningThread = Object.values(response).includes(true)
          if (!this.runningThread) {
            clearInterval(this.statusInterval)
            this.statusInterval = null
          }
        })
    },
    refreshTVS: function () {
      this.$q.notify({
        message: 'Scanning TVS Library',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('tvs/scan')
      this.threadStatus.tvs = true
      this.runningThread = true
      this.statusInterval = setInterval(this.refreshStatus, 10000)
    },
    refreshMovies: function () {
      this.$q.notify({
        message: 'Scanning Movies Library',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('movie/scan')
      this.threadStatus.movies = true
      this.runningThread = true
      this.statusInterval = setInterval(this.refreshStatus, 10000)
    },
    refreshUEp: function () {
      this.$q.notify({
        message: 'Scanning Upcoming Episodes',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('/tvs/scan/upcoming')
      this.threadStatus.upEpisodes = true
      this.runningThread = true
      this.statusInterval = setInterval(this.refreshStatus, 10000)
    },
    refreshCache: function () {
      this.$q.notify({
        message: 'Refreshing Cache',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('core/scan/cache')
      this.threadStatus.cache = true
      this.runningThread = true
      this.statusInterval = setInterval(this.refreshStatus, 10000)
    },
    refreshPeople: function () {
      this.$q.notify({
        message: 'Refreshing People',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('core/scan/person')
      this.threadStatus.people = true
      this.runningThread = true
      this.statusInterval = setInterval(this.refreshStatus, 10000)
    },
    refreshLogs: function () {
      this.$apiCall('core/log/50')
        .then((response) => {
          this.logs = response
        })
      this.$refs.logScroll.setScrollPosition(this.$refs.logScroll.getScrollTarget().scrollHeight)
    }
  }
})
</script>
