<template>
    <div>
        <q-slider @change="handleInput" @input="valChange" :value="value" :min="min" :max="max" ref="slider" label :label-value="labelVal" />
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'customSlider',
  data () {
    return {
      currentVal: -1
    }
  },
  methods: {
    handleInput (e) {
      if (e !== this.value) {
        this.$emit('update', e)
      }
    },
    valChange (value) {
      this.$refs.slider.$el.childNodes[0].childNodes[0].style.width = value / this.max * 100 + '%'
      this.currentVal = value
    }
  },
  mounted () {
    this.$refs.slider.$el.childNodes[0].innerHTML += "<div class='q-slider__track q-slider__track--h absolute' style='left: 0px; width: " + (this.buffered / this.max * 100) + '%;color:' + this.bufferedColor + ";z-index:-1;'></div>"
    this.currentVal = this.value
  },
  computed: {
    labelVal: function () {
      return Math.floor(this.currentVal / 60) + ':' + this.currentVal % 60
    }
  },
  watch: {
    buffered: function (newVal, oldVal) {
      this.$refs.slider.$el.childNodes[0].childNodes[1].style.width = newVal / this.max * 100 + '%'
    },
    value: function (newVal, oldVal) {
      this.$refs.slider.$el.childNodes[0].childNodes[0].style.width = newVal / this.max * 100 + '%'
      this.currentVal = newVal
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
