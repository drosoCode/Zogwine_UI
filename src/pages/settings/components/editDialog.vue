<template>
  <q-dialog ref="dialog" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin" style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">Edit Properties</div>
      </q-card-section>
      <q-card-section>
        <div v-for="(value, name) in filteredFields" :key="name">
          <editInput v-model="values[name]" :name="name" v-if="!advanced.includes(name)"/>
        </div>
        <q-expansion-item
          icon="mdi-alert"
          label="Advanced"
          header-class="text-red"
        >
          <q-card style="background-color: rgba(255,0,0,0.1);">
            <q-card-section>
              <div v-for="(value, name) in filteredFields" :key="name">
                <editInput v-model="values[name]" :name="name" v-if="advanced.includes(name)"/>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="amber" flat label="Cancel" @click="onCancelClick" />
        <q-btn color="amber" flat label="OK" @click="onOKClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import editInput from './editInput.vue'
export default {
  name: 'editDialog',
  components: { editInput },
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
      values: {},
      advanced: ['scraperName', 'scraperData', 'scraperID', 'idLib', 'path']
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
