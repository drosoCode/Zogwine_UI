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
          <q-td key="episodes" :props="props">
            <q-btn color="green" size="sm" @click="type = 1; id = props.row.id">
              {{ props.row.episodes }}
            </q-btn>
          </q-td>
          <q-td key="premiered" :props="props">
            <q-badge color="purple">
              {{ props.row.premiered }}
            </q-badge>
          </q-td>
          <q-td key="actions" :props="props">
            <q-btn color="primary" label="Update Metadata" size="sm" @click="update(props.row.id)"/>
            &nbsp;&nbsp;
            <q-btn color="red" label="Delete" size="sm" @click="deleteItem(props.row.id)"/>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'contentManager',
  data () {
    return {
      columns: [],
      data: [],
      id: -1,
      pagination: {
        rowsPerPage: 20
      }
    }
  },
  mounted () {
    this.loadData()
  },
  computed: {
    title: function () {
      if (this.type === 1) {
        return 'TV Shows / Episodes'
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
        url = 'tvs/show/' + this.id + '/episode'
        this.columns = [
          { name: 'title', align: 'center', label: 'Name', field: 'title', sortable: true },
          { name: 'season', label: 'Season', field: 'season' },
          { name: 'episode', label: 'Episode', field: 'episode' },
          { name: 'actions', label: 'Actions', field: 'actions' }
        ]
      } else if (this.type === 2) {
        this.id = -1
        url = 'tvs/show'
        this.columns = [
          { name: 'title', align: 'center', label: 'Name', field: 'title', sortable: true },
          { name: 'episodes', label: 'Episodes', field: 'episodes' },
          { name: 'premiered', label: 'Date', field: 'premiered' },
          { name: 'actions', label: 'Actions', field: 'actions' }
        ]
      } else if (this.type === 3) {
        this.id = -1
        url = 'movies/getMovies'
        this.columns = [
          { name: 'title', align: 'center', label: 'Name', field: 'title', sortable: true },
          { name: 'premiered', label: 'Date', field: 'premiered' },
          { name: 'actions', label: 'Actions', field: 'actions' }
        ]
      }

      this.$apiCall(url)
        .then((response) => {
          this.data = response
        })
    },
    deleteItem: function (id) {
      let url = ''
      if (this.type === 1) {
        url = 'tvs/episode/' + id
      } else if (this.type === 2) {
        url = 'tvs/' + id
      }

      this.$apiCall(url, null, 'delete')
        .then((response) => {
          console.log(response)
        })
    },
    update: function (id) {
      console.log('update ' + id)
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
