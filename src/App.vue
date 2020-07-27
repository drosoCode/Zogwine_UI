<template>
  <div id="q-app">
    <MainLayout>
      <q-page-container>
        <router-view />
      </q-page-container>
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
  }
}
</script>
