<template>
  <q-page>
    <q-card class="q-mx-md q-my-md">
      <q-checkbox v-model="showType[1]" label="TVS Episode" />
      <q-checkbox v-model="showType[2]" label="TVS" />
      <q-checkbox v-model="showType[3]" label="Movie" />
    </q-card>
    <div class="row wrap justify-around">
      <mediaCard v-for="r in filteredResults" :key="r[0] + ';' + r[1]" :mediaType="r[0]" :mediaData="r[1]" class="q-px-md q-pt-md col-xs-12 col-sm-6 col-md-6 col-lg-4 col-xl-3"/>
   </div>
  </q-page>
</template>

<script>
import Vue from 'vue'
import mediaCard from '../components/mediaCard'

export default Vue.extend({
  components: { mediaCard },
  data () {
    return {
      results: [],
      showType: {
        1: true,
        2: true,
        3: true
      }
    }
  },
  mounted () {
    const data = {
      andMode: this.$route.params.andMode
    }
    if (this.$route.params.name !== undefined && this.$route.params.name !== null) {
      data.name = this.$route.params.name
    }
    if (this.$route.params.date !== undefined && this.$route.params.date !== null) {
      data.date = this.$route.params.date
    }
    if (this.$route.params.tag !== undefined && this.$route.params.tag !== null) {
      data.tag = this.$route.params.tag
    }
    if (this.$route.params.person !== undefined && this.$route.params.person !== null) {
      data.person = this.$route.params.person
    }
    if (Object.keys(data).length <= 1) {
      this.$router.push({ name: 'search' })
    } else {
      this.$apiCall('/search', data, 'POST')
        .then((response) => { this.results = response })
    }
  },
  computed: {
    filteredResults: function () {
      const res = []
      this.results.forEach(e => {
        if (this.showType[e[0]]) {
          res.push(e)
        }
      })
      return res
    }
  }
})
</script>
