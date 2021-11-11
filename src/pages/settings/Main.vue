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
                <q-card class="q-my-lg">
                    <q-card-section>
                        <h5 class="q-my-lg">Library</h5>
                        <div class="row inline justify-between" style="width:100%">
                          <q-btn color="orange" label="Rescan Library" icon="refresh" class="q-ma-sm col-3" @click="refreshLibrary" :disable="refreshMediaType == null || refreshLibraryID == null"></q-btn>
                          <q-select v-model="refreshMediaType" :options="mediaTypeOptions" class="col-3" label="Media Type" @input="loadLibraries"/>
                          <q-select v-model="refreshLibraryID" :options="refreshLibraryIDOptions" class="col-3" label="Library ID" />
                          <q-checkbox v-model="refreshAutoAdd" label="Auto Add" />
                        </div>
                    </q-card-section>
                </q-card>
                <q-card class="q-mt-md">
                    <q-card-section>
                        <h5 class="q-my-lg">System</h5>
                        <q-btn color="orange" label="Refresh Upcoming Episodes" icon="refresh" class="q-ma-sm" @click="refreshUEp"></q-btn>
                        <q-btn color="orange" label="Refresh Cache" icon="refresh" class="q-ma-sm" @click="refreshCache"></q-btn>
                        <q-btn color="orange" label="Refresh People" icon="refresh" class="q-ma-sm" @click="refreshPeople"></q-btn>
                    </q-card-section>
                </q-card>
                <q-card class="q-my-lg">
                    <q-card-section>
                        <h5 class="q-my-lg">Sync</h5>
                        <q-btn color="orange" label="Trackers Scan" icon="refresh" class="q-ma-sm" @click="trackerScan"></q-btn>
                        <q-btn color="orange" label="Trackers Sync" icon="refresh" class="q-ma-sm" @click="trackerSync"></q-btn>
                    </q-card-section>
                </q-card>
                <q-card class="q-my-lg">
                    <q-card-section>
                        <h5 class="q-my-lg">About</h5>
                        <q-btn color="green" label="Swagger API" icon="mdi-api" class="q-ma-sm" @click="openSwagger()"></q-btn>
                        <q-btn color="grey-10" label="Github" icon="mdi-github" class="q-ma-sm" type="a" href="https://github.com/drosoCode/Zogwine" target="_blank"></q-btn>
                        <q-btn color="grey-10" label="Github UI" icon="mdi-github" class="q-ma-sm" type="a" href="https://github.com/drosoCode/Zogwine_UI" target="_blank"></q-btn>
                    </q-card-section>
                </q-card>
            </q-tab-panel>

            <q-tab-panel name="scrapers">
                <q-select v-model="scraperMediaType" :options="mediaTypeOptions" class="col-3" label="Media Type" @input="loadScraperItems"/>
                <div>
                    <scraperCard v-for="it in scraperItems" :key="it.id" :mediaType="it.mediaType" :mediaData="it.mediaData"/>
                </div>
            </q-tab-panel>

            <q-tab-panel name="content">
              <q-bar>
                <div class="cursor-pointer" @click="contentType = -1; contentType = 2">TV Shows</div>
                <div class="cursor-pointer" @click="contentType = -1; contentType = 3">Movies</div>
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
      refreshMediaType: null,
      mediaTypeOptions: [
        {
          label: 'TV Shows',
          value: 2
        },
        {
          label: 'Movies',
          value: 3
        }
      ],
      refreshLibraryID: null,
      refreshLibraryIDOptions: [],
      refreshAutoAdd: false,
      scraperMediaType: null,
      scraperItems: [],
      contentType: 2
    }
  },
  mounted () {
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
  methods: {
    // --------- library rescan methods -------
    refreshLibrary: function () {
      this.$q.notify({
        message: 'Scanning Library',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('scraper/scan/' + this.refreshMediaType.value + '/' + this.refreshLibraryID.value + '?autoadd=' + this.refreshAutoAdd, null, 'POST')
    },
    loadLibraries: function () {
      this.$apiCall('library?mediatype=' + this.refreshMediaType.value)
        .then((response) => {
          this.refreshLibraryIDOptions = []
          this.refreshLibraryID = null
          response.forEach(el => {
            this.refreshLibraryIDOptions.push({ label: el.name, value: el.id })
          })
        })
    },
    // ---------------- system methods ----------
    refreshUEp: function () {
      this.$q.notify({
        message: 'Scanning Upcoming Episodes',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('/tvs/scan/upcoming')
    },
    refreshCache: function () {
      this.$q.notify({
        message: 'Refreshing Cache',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('core/scan/cache')
    },
    refreshPeople: function () {
      this.$q.notify({
        message: 'Refreshing People',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('core/scan/person')
    },
    // --------  sync methods ---------------
    trackerScan: function () {
      this.$q.notify({
        message: 'Trackers Scan Started',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('tracker/scan/all')
    },
    trackerSync: function () {
      this.$q.notify({
        message: 'Trackers Sync Started',
        icon: 'done',
        position: 'bottom-left',
        color: 'teal'
      })
      this.$apiCall('tracker/sync/all')
    },
    // -------- scrapers tab methods ---------
    loadScraperItems: function () {
      this.$apiCall('scraper/result/' + this.scraperMediaType.value)
        .then((response) => {
          this.scraperItems = response
        })
    },
    // -------- log tab methods --------------
    refreshLogs: function () {
      this.$apiCall('core/log/50')
        .then((response) => {
          this.logs = response
        })
      this.$refs.logScroll.setScrollPosition(this.$refs.logScroll.getScrollTarget().scrollHeight)
    },
    // ----------------------
    openSwagger: function () {
      window.open(this.$store.getters.apiEndpoint + 'swagger/?token=' + this.$store.state.token, '_blank')
    }
  }
})
</script>
