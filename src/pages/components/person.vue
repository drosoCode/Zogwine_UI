<template>
  <div>
    <div class="q-px-md q-pt-md col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2">
        <q-card @click="showDetails">
            <q-img class="img" :src="$store.getters.imageEndpoint + img">
                <div class="absolute-bottom">
                    <div class="text-h6">{{ name }}</div>
                    <div class="text-subtitle2">{{ role }}</div>
                </div>
            </q-img>
        </q-card>
    </div>

    <q-dialog v-model="show">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ name }}</div>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          gender: {{ genderTxt }} <br>
          Birthdate: {{ birthdate }} <br>
          Deathdate: {{ deathdate }} <br>
          Known For: {{ known_for }} <br>
          Role: {{ role }}
          <br>
          <br>
          {{ description }}
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.img {
    height: 14rem;
    width: 10rem;
}
</style>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'person',
  data () {
    return {
      show: false
    }
  },
  computed: {
    genderTxt: function () {
      if (this.gender === 1) {
        return 'Female'
      } else if (this.gender === 2) {
        return 'Male'
      } else {
        return this.gender
      }
    }
  },
  methods: {
    showDetails: function () {
      this.show = true
    }
  },
  props: {
    name: {
      required: true
    },
    role: {
      required: true
    },
    img: {
      required: true
    },
    id: {
      required: true
    },
    description: {
      required: false,
      default: 'No data available'
    },
    birthdate: {
      required: false,
      default: null
    },
    deathdate: {
      required: false,
      default: null
    },
    known_for: {
      required: false,
      default: null
    },
    gender: {
      required: false,
      default: null
    }
  }
})
</script>
