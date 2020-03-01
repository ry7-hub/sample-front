<template>
<v-container>
<v-form>
  <v-card>
    <v-alert
      :value="error"
      type="error"
    >
      メールアドレスとパスワードの組みが正しくありません
    </v-alert>
    <v-card-title primary-title>
      <h3 class="headline mb-0">ログイン</h3>
    </v-card-title>
    <v-card-text>
      <v-text-field 
        v-model="email"
        label="メールアドレス"
        required
      />
      <v-text-field
        v-model="password"
        label="パスワード"
        required
      />
    </v-card-text>
    <div style="width: 100%; text-align: center; padding-bottom: 10px;">
      <v-btn dark @click="submit">ログイン</v-btn>
    </div>
  </v-card>
</v-form>
</v-container>
</template>

<script>

export default {
  data() {
    return {
      email: '',
      password: '',
      error: false
    }
  },
  middleware: 'guest',
  methods: {
    async submit () {
      try {
        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          }
        })
        this.$router.push('/attendance_list')
      } catch (e) {
        this.error = true
      }
    }
  }
}
</script>

<style>
</style>
