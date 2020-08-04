<template>
    <q-card class="text-white elevated q-pa-md" ref="statCard">
      <q-card-section horizontal>
        <q-icon :name="icon" style="font-size: 4rem;" />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div>
          <div class="text-subtitle2">{{ title}}</div>
          <div class="text-h4">{{ value }}</div>
        </div>
      </q-card-section>
    </q-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'statCard',
  props: {
    value: {
      required: true
    },
    title: {
      required: true
    },
    icon: {
      required: true
    },
    color: {
      required: true
    }
  },
  watch: {
    color: function (newVal, oldVal) {
      this.$refs.statCard.$el.classList.add('bg-' + oldVal)
      this.$refs.statCard.$el.classList.remove('bg-' + newVal)
    }
  },
  mounted: function () {
    this.$refs.statCard.$el.classList.add('bg-' + this.color)
  }
})
</script>
