<template>
    <div>
        <q-slider v-model="progress" :min="min" :max="max" ref="slider" />
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'customSlider',
  data () {
    return {
      progress: this.value
    }
  },
  methods: {
    handleInput (e) {
      this.$emit('input', this.progress)
    }
  },
  mounted () {
    this.$refs.slider.$el.childNodes[0].innerHTML += "<div class='q-slider__track q-slider__track--h absolute' style='left: 0px; width: " + this.buffered + '%;color:' + this.bufferedColor + ";z-index:-1;'></div>"
  },
  watch: {
    buffered: function (newVal, oldVal) {
      this.$refs.slider.$el.childNodes[0].childNodes[1].style.width = newVal + '%'
    },
    progress: function (newVal, oldVal) {
      this.$refs.slider.$el.childNodes[0].childNodes[0].style.width = newVal / this.max * 100 + '%'
    }
  },
  props: {
    value: {
      required: true
    },
    min: {
      required: false,
      default: 0
    },
    max: {
      required: true
    },
    buffered: {
      required: true
    },
    bufferedColor: {
      required: false,
      default: '#00FF00'
    }
  }
})
</script>
