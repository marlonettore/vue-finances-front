<template>
  <v-app-bar
    app
    fixed
    color="primary"
  >
    <v-app-bar-nav-icon @click.stop="$emit('hide', !showMenu)"></v-app-bar-nav-icon>
    <v-toolbar-title> {{ title || 'Dashboard'}} </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-btn
        icon
        @click="showLogoutDialog=true"
      >
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar-items>

    <v-dialog
      v-model="showLogoutDialog"
      max-width="250px"
    >
      <v-card>
        <v-card-title>
          <h3 class="subheading">Deseja realmente sair?</h3>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            small
            @click="showLogoutDialog = false"
          >
            Não
          </v-btn>
          <v-btn
            text
            small
            @click="logout"
          >
            Sim
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app-bar>
</template>

<script>

import { mapState } from 'vuex'
import apollo, { onLogout } from '@/plugins/apollo'

export default {
  name: 'AppToolbar',
  props: {
    showMenu: Boolean
  },
  model: {
    prop: 'showMenu',
    event: 'hide'
  },
  data: () => ({
    showLogoutDialog: false
  }),
  computed: {
    ...mapState(['title'])
  },
  methods: {
    async logout (e) {
      this.$router.push('/login')
      await onLogout(apollo)
    }
  }
}
</script>
