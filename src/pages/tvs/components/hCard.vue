<template>
  <div class="q-px-md q-pt-md">
      <q-card>
        <q-card-section horizontal>
          <q-img
            class="col-5"
            :src="img"
          />

          <q-card-section>
            <div class="text-h5 q-mt-sm q-mb-xs">{{ title }}</div>
            <div class="text-caption text-grey">
              Premiered: 2012-07-16<br>
              Rating: 8<br>
              Seasons: 3<br><br>
              <q-chip square color="teal" text-color="white" icon="done">Watched 24</q-chip>
              <!--
              <q-chip square color="orange" text-color="white" icon="schedule">Watching 12/24</q-chip>
              <q-chip square color="red" text-color="white" icon="highlight_off">Not Started 24</q-chip>-->
              <br><br>
              <q-btn round color="primary" size="md" icon="play_arrow" style="margin-left: 10px; margin-right: 10px;"/>
              <q-btn round color="primary" size="md" icon="info"/>
            </div>
          </q-card-section>
        </q-card-section>
      </q-card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'hCard',
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    img: {
      type: String,
      required: true,
      default: 'https://cdn.quasar.dev/img/parallax1.jpg'
    }
  },
  mounted: function () {
    this.$q.dark.set(true)
  }
})
</script>
