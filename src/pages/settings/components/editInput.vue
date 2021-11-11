<template>
  <div>
    <div class="q-gutter-sm" v-if="name === 'forceUpdate'">
        <q-radio :value="value" @input="updateValue" :val="1" label="Update" />
        <q-radio :value="value" @input="updateValue" :val="0" label="No Update" />
        <q-radio :value="value" @input="updateValue" :val="-1" label="Freeze" />
    </div>
    <q-input :value="value" @input="updateValue" :label="name" type="number" v-else-if="name === 'rating' || name === 'idLib'"/>
    <q-input :value="value" @input="updateValue" :label="name" type="date" v-else-if="name === 'premiered'"/>
    <q-input :value="value" @input="updateValue" :label="name" autogrow v-else-if="name === 'overview'"/>
    <q-input :value="value" @input="updateValue" :label="name" v-else/>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'editInput',
  props: {
    name: {
      required: true
    },
    value: {
      required: true
    }
  },
  methods: {
    updateValue: function (value) {
      this.$emit('input', value)
    }
  }
})
</script>
