<template>
  <div id="q-app">
    <MainLayout>
    </MainLayout>
  </div>
</template>

<script>
import MainLayout from './layouts/MainLayout.vue'

export default {
  components: { MainLayout },
  name: 'App',
  meta: {
    meta: {
      robots: { name: 'robots', content: 'noindex' }
    }
  },
  mounted: function () {
    this.$q.dark.set(this.$store.getters.darkMode)
  }
}
</script>
