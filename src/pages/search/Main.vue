<template>
  <q-page>
    <div class="row wrap justify-around">
      <div class="col-10 row wrap justify-around">
        <q-input v-model="name" label="Title" class="col-xs-12 col-sm-10 col-md-6 col-lg-6 col-xl-6 q-pr-md"/>
        <q-input v-model="date" class="col-xs-12 col-sm-10 col-md-2 col-lg-2 col-xl-2" type="date" v-if="dateType == 2"/>
        <q-input v-model="date" class="col-xs-12 col-sm-10 col-md-2 col-lg-2 col-xl-2" type="number" v-if="dateType == 1" />
        <q-btn-toggle
          class="col-xs-12 col-sm-10 col-md-2 col-lg-2 col-xl-2"
          v-model="dateType"
          toggle-color="primary"
          :options="[
            {label: 'OFF', value: 0},
            {label: 'Year', value: 1},
            {label: 'Date', value: 2}
          ]"
          />
        <q-toggle v-model="andMode" :label="'Mode: ' + (andMode ? 'AND' : 'OR')" class="col-xs-12 col-sm-10 col-md-2 col-lg-2 col-xl-2"/>
      </div>

      <q-btn color="primary" class="col-10 q-mt-lg" label="Search" icon="search" @click="search"/>

      <div class="col-10 q-mt-lg row wrap justify-around">
        <q-card class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
          <q-card-section>
            <q-input v-model="personSearch" label="Search Person">
              <template v:after>
                <q-btn color="primary" icon="search" @click="searchPerson" />
              </template>
            </q-input>
          </q-card-section>
          <q-card-section>
            <div class="row wrap">
              <div v-for="p in peopleList" :key="p.id" class="q-px-md q-pt-md col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2">
                <q-card @click="removePerson(p.id)">
                  <q-img class="img" :src="(p.icon === null ?  '/images/undefined_v.png' : $store.getters.imageEndpoint + p.icon)" @error="p.icon = null">
                    <div class="absolute-bottom">
                      <div class="text-h6">{{ p.name }}</div>
                    </div>
                  </q-img>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
          <q-card-section class="row justify-around">
            <q-select v-model="addTagCatgValue" :options="addTagCatg" @input="updateTagSelect" label="Category" class="col-5"/>
            <q-select v-model="addTagValValue" :options="addTagValOptionsFiltered" label="Value" class="col-5" use-input @filter="filterTagVal" />
            <q-btn color="primary" label="Add" @click="addTag" class="col-2"/>
          </q-card-section>
          <q-card-section>
            <q-chip v-for="t in tags" square removable @remove="removeTag(t.id)" color="primary" text-color="white" :key="t.id">
              <q-avatar>
                <img :src="$store.getters.imageEndpoint + t.icon" v-if="t.icon !== null">
                <q-icon color="white" size="sm" :name="$getTagIcon(t.name)" v-if="t.icon === null" />
              </q-avatar>
              {{ t.name }} : {{ t.value }}
            </q-chip>
          </q-card-section>
        </q-card>
      </div>

      <q-dialog v-model="showPeopleSelect">
        <q-card style="max-width: 52rem; width: 52rem;">
          <q-card-section>
            <div class="text-h6">People</div>
          </q-card-section>
          <q-separator />
          <q-card-section style="max-height: 70vh" class="scroll">
            <div class="row wrap">
              <div v-for="p in availablePeopleList" :key="p.id" class="q-px-md q-pt-md col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2">
                <q-card @click="addPerson(p)">
                  <q-img class="img" :src="(p.icon === null ?  '/images/undefined_v.png' : $store.getters.imageEndpoint + p.icon)" @error="p.icon = null">
                    <div class="absolute-bottom">
                      <div class="text-h6">{{ p.name }}</div>
                    </div>
                  </q-img>
                </q-card>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat label="Close" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

   </div>
  </q-page>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      name: '',
      dateType: 0,
      date: null,
      addTagCatg: [],
      addTagCatgValue: '',
      addTagVal: [],
      addTagValOptions: [],
      addTagValOptionsFiltered: [],
      addTagValValue: '',
      tags: [],
      onlyYear: false,
      andMode: false,
      showPeopleSelect: false,
      availablePeopleList: [],
      personSearch: '',
      peopleList: []
    }
  },
  mounted () {
    this.$apiCall('tag/category')
      .then((response) => { this.addTagCatg = response })
  },
  methods: {
    addTag: function () {
      let found = false
      this.tags.forEach(t => {
        if (t.id === this.addTagValValue.value) {
          found = true
        }
      })
      if (!found) {
        this.tags.push(this.addTagVal[this.addTagValValue.value])
      }
    },
    removeTag: function (id) {
      for (let i = 0; i < this.tags.length; i++) {
        if (this.tags[i].id === id) {
          this.tags.splice(i, 1)
          return
        }
      }
    },
    updateTagSelect: function () {
      this.$apiCall('tag/category/' + this.addTagCatgValue)
        .then((response) => {
          this.addTagValOptions = []
          this.addTagVal = []
          response.forEach(el => {
            this.addTagValOptions.push({ label: el.value, value: el.id })
            this.addTagVal[el.id] = el
          })
          this.addTagValOptionsFiltered = this.addTagValOptions
        })
    },
    filterTagVal: function (val, update) {
      update(() => {
        if (val === '') {
          this.addTagValOptionsFiltered = this.addTagValOptions
        } else {
          const needle = val.toLowerCase()
          this.addTagValOptionsFiltered = this.addTagValOptions.filter(
            v => v.label.toLowerCase().indexOf(needle) > -1
          )
        }
      })
    },
    searchPerson: function () {
      if (this.personSearch !== '') {
        this.$apiCall('/person/name/' + this.personSearch)
          .then((response) => {
            this.availablePeopleList = response
            this.showPeopleSelect = true
          })
      }
    },
    addPerson: function (data) {
      let found = false
      this.peopleList.forEach(p => {
        if (p.id === data.id) {
          found = true
        }
      })
      if (!found) {
        this.peopleList.push(data)
        this.showPeopleSelect = false
      }
    },
    removePerson: function (id) {
      for (let i = 0; i < this.peopleList.length; i++) {
        if (this.peopleList[i].id === id) {
          this.peopleList.splice(i, 1)
          return
        }
      }
    },
    search: function () {
      let d = null
      if ((this.dateType === 1 && this.date !== '') || this.date === 2) {
        d = this.date
      }
      let t = []
      this.tags.forEach(tag => {
        t.push(tag.id)
      })
      if (t.length === 0) {
        t = null
      }
      let p = []
      this.peopleList.forEach(person => {
        p.push(person.id)
      })
      if (p.length === 0) {
        p = null
      }
      this.$router.push({ name: 'search_result', params: { date: d, tag: t, person: p, name: (this.name !== '' ? this.name : null), andMode: this.andMode } })
    }
  }
})
</script>
