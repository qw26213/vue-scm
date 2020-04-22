<template>
  <div>
    <svg-icon icon-class="help" title="帮助" @click="click" />
  </div>
</template>
<script>
export default {
  name: 'help',
  data() {
    return {
      isFullscreen: false
    }
  },
  methods: {
    click() {
      this.$router.push('/user/help')
    }
  }
}
</script>

<style scoped>
.qq-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
