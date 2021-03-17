<template>
  <div>
    <q-layout view="hHh Lpr lFf" v-if="$store.getters.showNavigation">
      <q-header elevated>
        <q-ajax-bar
          ref="bar"
          position="top"
          color="blue-10"
          size="4px"
        />

        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />

          <q-toolbar-title>
            {{ $store.state.appName }}
          </q-toolbar-title>

          <!--<div>Quasar v{{ $q.version }}</div>-->
          <q-toggle
            v-model="dark"
            checked-icon="mdi-weather-night"
            color="black"
            unchecked-icon="mdi-white-balance-sunny"
            @input="darkMode"
          />
          <q-btn flat icon="mdi-exit-to-app" :label="$store.getters.username" @click="logout" v-if="$store.getters.isAuthenticated"/>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        elevated
        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"
      >
        <q-list v-focus-section>
          <q-item v-focus clickable :to="{name: 'home'}" exact>
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Home</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-focus clickable :to="{name: 'movies'}">
            <q-item-section avatar>
              <q-icon name="movie" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Movies</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-focus clickable :to="{name: 'tvshows'}">
            <q-item-section avatar>
              <q-icon name="tv" />
            </q-item-section>
            <q-item-section>
              <q-item-label>TV Shows</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-focus clickable :to="{name: 'music'}">
            <q-item-section avatar>
              <q-icon name="music_note"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Music</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-focus clickable :to="{name: 'games'}">
            <q-item-section avatar>
              <q-icon name="videogame_asset"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Games</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-focus clickable :to="{name: 'books'}">
            <q-item-section avatar>
              <q-icon name="library_books"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Books</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-focus clickable :to="{name: 'mangas'}">
            <q-item-section avatar>
              <q-icon name="texture"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Mangas</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator/>

          <q-item v-focus clickable :to="{name: 'devices'}" v-if="$store.getters.cast">
            <q-item-section avatar>
              <q-icon name="memory"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Devices</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-focus clickable :to="{name: 'search'}">
            <q-item-section avatar>
              <q-icon name="search"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Search</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-focus clickable :to="{name: 'player'}">
            <q-item-section avatar>
              <q-icon name="play_arrow"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Player</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator/>

          <q-item v-focus clickable :to="{name: 'settings'}" v-if="$store.getters.isAdmin">
            <q-item-section avatar>
              <q-icon name="settings"/>
            </q-item-section>
            <q-item-section>
              <q-item-label>Settings</q-item-label>
            </q-item-section>
          </q-item>

        </q-list>
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
    <q-layout v-if="!$store.getters.showNavigation">
      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>

export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false,
      miniState: true,
      dark: false
    }
  },
  methods: {
    logout: function () {
      this.$store.dispatch('logout').then((resp) => {
        this.$router.push('/login')
      })
    },
    darkMode: function () {
      this.$store.dispatch('darkMode', this.dark)
      this.$q.dark.set(this.dark)
    },
    clickFocusedElement: function () {
      const element = document.activeElement
      if (element.click() === undefined) {
        element.childNodes.forEach(el => {
          if (el.tagName === 'A') {
            el.click()
          }
        })
      }
    },
    handleKeyUp: function (key) {
      if (key.key === 'Escape' && !this.$store.getters.showNavigation) {
        this.$store.dispatch('showNavigation', true)
      } else if (key.key === 'Enter') {
        this.clickFocusedElement()
      }
    }
  },
  mounted: function () {
    this.dark = this.$store.getters.darkMode
    window.newUpdateObj = { newUpdate: false }
    window.newUpdateProxy = new Proxy(window.newUpdateObj, {
      set: (target, key, value) => {
        if (value) {
          this.$q.notify({
            message: 'Updating application ...',
            icon: 'sync',
            position: 'bottom-left',
            color: 'light-blue'
          })
          target[key] = value
        }
        return true
      }
    })
    window.addEventListener('keyup', this.handleKeyUp)
  },
  beforeDestroy () {
    window.removeEventListener('keyup', this.handleKeyUp)
  }
}
</script>
