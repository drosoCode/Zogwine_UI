<template>
  <q-page class="row justify-center items-center">
        <q-card elevated class="shadow-3 bg-purple-10 text-white" style="width:26rem">
          <q-card-section class="text-center">
            <q-icon name="mdi-key-variant" style="font-size: 5em;"/>
            <h4 >{{ $store.state.appName }}</h4>
          </q-card-section>
          <q-card-section class="bg-grey-10">
            <q-form @submit.prevent="login">
              <q-input v-model="username" label="Username" />
              <q-input v-model="password" label="Password" type="password"/>
              <br>
              <q-btn color="secondary" label="Login" type="submit" class="full-width"/>
              <div>
                <q-checkbox label="Remember Me" v-model="remember" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
  </q-page>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      remember: false,
      username: localStorage.getItem('zogwine-user') || '',
      password: ''
    }
  },
  methods: {
    login: function () {
      this.$store.dispatch('login', [this.username, this.password, this.remember]).then((resp) => {
        if (resp) {
          this.$router.push(this.$route.query.redirect || '/')
        } else {
          this.$q.notify({
            message: 'Login Failed',
            icon: 'mdi-alert',
            position: 'bottom-left',
            color: 'red'
          })
        }
      })
    },
    webauthn: function () {
      this.$store.dispatch('login', [this.username, this.password]).then((resp) => {
        if (resp) {
          this.$router.push('/')
        }
      })
    }
  }
})
</script>
