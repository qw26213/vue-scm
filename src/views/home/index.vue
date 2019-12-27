<template>
  <div class="dashboard-container">
    <adminDashboard />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'

export default {
  name: 'home',
  components: { adminDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
