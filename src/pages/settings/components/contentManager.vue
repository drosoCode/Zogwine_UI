<template>
  <div class="q-pa-md">
    <q-table
      :title="title"
      :data="data"
      :columns="columns"
      :pagination="pagination"
      row-key="name"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="title" :props="props">
            {{ props.row.title }}
          </q-td>
          <q-td key="season" :props="props">
              {{ props.row.season }}
          </q-td>
          <q-td key="episode" :props="props">
              {{ props.row.episode }}
          </q-td>
          <q-td key="seasons" :props="props">
            <q-btn color="green" size="sm" @click="type = 5; id = props.row.id">
              {{ props.row.season }}
            </q-btn>
          </q-td>
          <q-td key="episodes" :props="props">
            <q-btn color="green" size="sm" @click="type = 1; id = props.row.id">
              {{ props.row.episode }}
            </q-btn>
          </q-td>
          <q-td key="premiered" :props="props">
            <q-badge color="purple">
              {{ $formatDate(props.row.premiered) }}
            </q-badge>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn color="primary" label="Update Metadata" size="sm" @click="editItem(props.row)"/>
            &nbsp;&nbsp;
            <q-btn color="red" label="Update Video Metadata" size="sm" @click="editVideoFile(props.row)" v-if="type == 1 || type == 3"/>
            &nbsp;&nbsp;
            <q-btn color="red" label="Reset Scraper" size="sm" @click="resetScraper(props.row)" v-if="type == 2 || type == 3"/>
            &nbsp;&nbsp;
            <q-btn color="red" label="Delete" size="sm" @click="deleteItem(props.row)"/>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import editDialog from './editDialog.vue'

export default defineComponent({
  name: 'contentManager',
  data () {
    return {
      columns: [],
      data: [],
      id: -1,
      pagination: {
        rowsPerPage: 20
      },
      selectedProps: {}
    }
  },
  mounted () {
    this.loadData()
  },
  computed: {
    title: function () {
      if (this.type === 1) {
        return 'TV Shows / Episodes'
      } else if (this.type === 5) {
        return 'TV Shows / Seasons'
      } else if (this.type === 2) {
        return 'TV Shows'
      } else if (this.type === 3) {
        return 'Movies'
      }
    }
  },
  methods: {
    loadData: function () {
      let url = ''
      if (this.type === 1) {
        url = 'tvs/' + this.id + '/episode'
        this.columns = [
          { name: 'title', align: 'center', label: 'Name', field: 'title', sortable: true },
          { name: 'season', label: 'Season', field: 'season', sortable: true },
          { name: 'episode', label: 'Episode', field: 'episode', sortable: true },
          { name: 'actions', label: 'Actions', field: 'actions' }
        ]
      } else if (this.type === 5) {
        url = 'tvs/' + this.id + '/season'
        this.columns = [
          { name: 'title', align: 'center', label: 'Name', field: 'title', sortable: true },
          { name: 'season', label: 'Season', field: 'season', sortable: true },
          { name: 'actions', label: 'Actions', field: 'actions' }
        ]
      } else if (this.type === 2) {
        this.id = -1
        url = 'tvs'
        this.columns = [
          { name: 'title', align: 'center', label: 'Name', field: 'title', sortable: true },
          { name: 'seasons', label: 'Seasons', field: 'seasons', sortable: true },
          { name: 'episodes', label: 'Episodes', field: 'episodes', sortable: true },
          { name: 'premiered', label: 'Date', field: 'premiered', sortable: true },
          { name: 'actions', label: 'Actions', field: 'actions' }
        ]
      } else if (this.type === 3) {
        this.id = -1
        url = 'movie'
        this.columns = [
          { name: 'title', align: 'center', label: 'Name', field: 'title', sortable: true },
          { name: 'premiered', label: 'Date', field: 'premiered', sortable: true },
          { name: 'actions', label: 'Actions', field: 'actions' }
        ]
      }

      this.$apiCall(url)
        .then((response) => {
          this.data = response
        })
    },
    getEndpoint: function (data) {
      let url = ''
      if (this.type === 1) {
        url = 'tvs/episode/' + data.id
      } else if (this.type === 2) {
        url = 'tvs/' + data.id
      } else if (this.type === 3) {
        url = 'movie/' + data.id
      } else if (this.type === 5) {
        url = 'tvs/' + data.idShow + '/season/' + data.season
      }
      return url
    },
    deleteItem: function (data) {
      this.selectedProps = data

      this.$q.dialog({
        title: 'Delete Item',
        message: 'Do you really want to delete ' + data.title + ' ?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$apiCall(this.getEndpoint(this.selectedProps), null, 'delete')
          .then((response) => {
            console.log(response)
          })
      })
    },
    editItem: function (data) {
      this.selectedProps = data

      this.$apiCall(this.getEndpoint(this.selectedProps)).then((response) => {
        this.$q.dialog({
          component: editDialog,
          fields: response,
          type: this.type
        }).onOk((data) => {
          this.$apiCall(this.getEndpoint(this.selectedProps), data, 'PUT')
        })
      })
    },
    editVideoFile: function (data) {
      this.selectedProps = data

      this.$apiCall('player/property/' + this.type + '/' + this.selectedProps.id).then((response) => {
        this.$q.dialog({
          component: editDialog,
          fields: response
        }).onOk((data) => {
          this.$apiCall('player/property/' + this.type + '/' + this.selectedProps.id, data, 'PUT')
        })
      })
    },
    resetScraper: function (data) {
      this.selectedProps = data

      this.$q.dialog({
        title: 'This action will reset the associated scraper, continue ?',
        message: 'Current title',
        prompt: {
          model: data.title,
          type: 'text'
        },
        cancel: true,
        persistent: true
      }).onOk((title) => {
        if (this.type === 2) {
          const req = {
            fanart: null,
            forceUpdate: 1,
            icon: null,
            overview: null,
            premiered: null,
            rating: -1,
            scraperData: null,
            scraperID: null,
            scraperLink: null,
            scraperName: null,
            title: title
          }
          this.$apiCall('tvs/' + this.selectedProps.id, req, 'PUT')
        }
      })
    }
  },
  watch: {
    type: function (newVal, oldVal) {
      this.loadData()
    },
    id: function (newVal, oldVal) {
      this.loadData()
    }
  },
  props: {
    type: {
      required: true
    }
  }
})
</script>
