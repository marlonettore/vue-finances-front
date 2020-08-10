<template>
  <div>
    <h1>Lançamentos</h1>
    <RecordsList />
  </div>

</template>

<script>

import { mapActions } from 'vuex'
import RecordsList from './../components/RecordsList'

export default {
  name: 'RecordsHome',
  components: {
    RecordsList
  },
  created () {
    this.setTitle({ title: 'Lançamentos' })
  },
  methods: {
    ...mapActions(['setTitle'])
  }
}
</script>
