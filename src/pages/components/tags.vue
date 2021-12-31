<template>
    <q-card>
        <q-card-section>
          <div class="text-h6">Tags</div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
            <div class="q-pa-md" style="max-width: 350px">
                <q-list bordered>
                    <q-item clickable v-ripple @click="showPeople">
                        <q-item-section avatar>
                        <q-avatar rounded>
                            <q-icon color="primary" name="people" />
                        </q-avatar>
                        </q-item-section>
                        <q-item-section>People</q-item-section>
                    </q-item>

                    <div v-for="item in tags" :key="item.id">
                        <q-separator />
                        <q-item clickable v-ripple :to="{ name: 'search', params: { tag: [item.id] } }">
                            <q-item-section avatar>
                            <q-avatar rounded>
                                <img :src="$getImageLink(item.icon)" v-if="item.icon !== null">
                                <q-icon color="primary" :name="$getTagIcon(item.name)" v-if="item.icon === null" />
                            </q-avatar>
                            </q-item-section>
                            <q-item-section>{{ capitalize(item.name) }}: {{ item.value }}</q-item-section>
                        </q-item>
                    </div>
                </q-list>
            </div>
        </q-card-section>

        <q-dialog v-model="showPeopleData">
          <q-card style="max-width: 52rem; width: 52rem;">
            <q-card-section>
              <div class="text-h6">People</div>
            </q-card-section>
            <q-separator />
            <q-card-section style="max-height: 70vh" class="scroll">
                <div class="row wrap">
                    <person v-for="person in people" :key="person.id" :name="person.name" :role="person.role" :id="person.id"  :img="person.icon" :description="person.description" :birthdate="person.birthdate" :deathdate="person.deathdate" :known_for="person.known_for" :gender="person.gender" />
                </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <q-btn flat label="Close" color="primary" v-close-popup />
            </q-card-actions>
          </q-card>
        </q-dialog>

    </q-card>
</template>

<script>
import { format } from 'quasar'
import { defineComponent } from '@vue/composition-api'
import person from './person'

export default defineComponent({
  components: { person },
  name: 'tags',
  data () {
    return {
      tags: [],
      people: [],
      showPeopleData: false
    }
  },
  methods: {
    capitalize: function (name) {
      return format.capitalize(name)
    },
    showPeople: function () {
      if (this.people.length === 0) {
        this.$apiCall('person/' + this.mediaType + '/' + this.idMedia)
          .then((response) => {
            this.people = response
            this.showPeopleData = true
          })
      } else {
        this.showPeopleData = true
      }
    }
  },
  mounted () {
    this.$apiCall('tag/' + this.mediaType + '/' + this.idMedia)
      .then((response) => {
        this.tags = response
      })
  },
  props: {
    idMedia: {
      required: true
    },
    mediaType: {
      required: true
    }
  }
})
</script>
