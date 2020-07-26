<template>
    <span v-html="line"></span>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'logLine',
  computed: {
    line: function () {
      let dat = this.data
      dat = dat.replace('INFO', '<span class="text-teal">INFO</span>')
      dat = dat.replace('DEBUG', '<span class="text-cyan">DEBUG</span>')
      dat = dat.replace('WARNING', '<span class="text-orange">WARNING</span>')
      dat = dat.replace('ERROR', '<span class="text-red">ERROR</span>')
      dat = dat.replace('CRITICAL', '<span class="text-red">CRITICAL</span>')
      const index = dat.indexOf('::')
      dat = '<span class="text-grey">' + dat.substring(0, index) + '</span> :: <span class="text-light">' + dat.substring(index + 2) + '</span><br>'
      return dat
    }
  },
  props: {
    data: {
      type: String,
      required: true
    }
  }
})
</script>
