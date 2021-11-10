<template>
  <q-dialog ref="dialog" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">Edit Properties</div>
      </q-card-section>
      <q-card-section>
        <div v-for="(value, name) in filteredFields"  :key="name">
            <div class="q-gutter-sm" v-if="name === 'forceUpdate'">
                <q-radio v-model="values[name]" :val="1" label="Update" />
                <q-radio v-model="values[name]" :val="0" label="No Update" />
                <q-radio v-model="values[name]" :val="-1" label="Freeze" />
            </div>
            <q-input v-model="values[name]" :label="name" type="number" v-else-if="name === 'rating' || name === 'idLib'"/>
            <q-input v-model="values[name]" :label="name" type="date" v-else-if="name === 'premiered'"/>
            <q-input v-model="values[name]" :label="name" autogrow v-else-if="name === 'overview'"/>
            <q-input v-model="values[name]" :label="name" v-else/>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="amber" flat label="Cancel" @click="onCancelClick" />
        <q-btn color="amber" flat label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'editDialog',
  props: {
    type: {
      required: true
    },
    fields: {
      required: true
    }
  },
  emits: ['ok', 'hide'],
  data () {
    return {
      filteredFields: {},
      values: {}
    }
  },
  mounted () {
    const allowedFields = ['title', 'overview', 'icon', 'fanart', 'rating', 'premiered', 'scraperID', 'scraperName', 'scraperData', 'scraperLink', 'idLib', 'path', 'forceUpdate']
    Object.keys(this.fields).forEach(i => {
      if (allowedFields.includes(i)) {
        this.filteredFields[i] = this.fields[i]
      }
    })
    this.values = Object.assign({}, this.filteredFields)
  },
  methods: {
    show () {
      this.$refs.dialog.show()
    },
    hide () {
      this.$refs.dialog.hide()
    },
    onDialogHide () {
      this.$emit('hide')
    },
    onCancelClick () {
      this.hide()
    },
    onOKClick () {
      const ret = {}
      Object.keys(this.filteredFields).forEach(i => {
        if (this.filteredFields[i] !== this.values[i]) {
          if (this.values[i] === '') { ret[i] = null } else { ret[i] = this.values[i] }
        }
      })
      this.$emit('ok', ret)
      this.hide()
    }
  }
}
</script>
