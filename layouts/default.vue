<template>
<v-app id="inspire">
  <v-app-bar dark fixed app>
    <v-toolbar-title>勤怠管理</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn text v-if="isAuthenticated" @click="logout">ログアウト</v-btn>
      <v-btn text to="/login" v-if="!isAuthenticated">ログイン</v-btn>
    </v-toolbar-items>
  </v-app-bar>
  <v-content>
    <v-container fluid fill-height>
      <nuxt/>
    </v-container>
  </v-content>
</v-app>
</template>
<script>

export default {
  computed: {
    isAuthenticated () {
      return this.$auth.loggedIn
    },
  },
  methods: {
    async logout() {
      await this.$auth.logout();
    },
  },
}
</script>
<style>
</style>
